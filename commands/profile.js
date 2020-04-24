/**
 * Copyright (C) 2020 tt.bot dev team
 * 
 * This file is part of tt.bot.
 * 
 * tt.bot is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * tt.bot is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with tt.bot.  If not, see <http://www.gnu.org/licenses/>.
 */

"use strict";
const { Command, SerializedArgumentParser, ParsingError } = require("sosamba");
const moment = require("moment");
const UserProfile = require("../lib/Structures/UserProfile");
const RemoveSymbol = Symbol("tt.bot.profile.remove");
const SetupSymbol = Symbol("tt.bot.profile.setup");
const TimezoneSymbol = Symbol("tt.bot.profile.timezone");
const LocaleSymbol = Symbol("tt.bot.profile.locale");

class ProfileCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "profile",
            argParser: new SerializedArgumentParser(sosamba, {
                args: [{
                    name: "action",
                    type: val => {
                        if (val === "remove") return RemoveSymbol;
                        else if (val === "setup") return SetupSymbol;
                        else if (val === "timezone") return TimezoneSymbol;
                        else if (val === "locale") return LocaleSymbol;
                        throw new ParsingError("Invalid action");
                    },
                    description: "the action to do with your profile: remove, setup, timezone, locale"
                }, {
                    type: String,
                    description: "an additional argument, if needed (the timezone for `timezone` and the language for `locale`)",
                    default: SerializedArgumentParser.None
                }],
            }),
            description: "Manages the data we know about you."
        });
    }

    async run(ctx, [action, arg]) {
        if (action === RemoveSymbol) {
            if ((await ctx.userProfile).fake) return ctx.send(await ctx.t("PROFILE_NONEXISTENT"));
            else {
                await ctx.db.deleteUserProfile(ctx.author.id);
                ctx.send(await ctx.t("PROFILE_DELETED"));
            }
        } else if (action === SetupSymbol) {
            if (!(await ctx.userProfile).fake) return ctx.send("You have a profile already!");
            await ctx.send(await ctx.t("PROFILE_CREATE_SETUP"));
            const { response, context } = await ctx.askYesNo(true);
            const profile = {
                id: ctx.author.id
            };

            if (response) {
                try {
                    await context.msg.delete(); 
                } catch {/**/ }
                await ctx.send(await ctx.t("PROFILE_CREATE_TIMEZONE"));
                const m = await ctx.waitForMessage(async ctx => {
                    if (ctx.msg.content.toLowerCase() === "none") return true;
                    if (!moment.tz.zone(ctx.msg.content)) {
                        await ctx.msg.channel.createMessage(await ctx.t("INVALID_TIMEZONE"));
                        return false;
                    }
                    return true;
                }, 30000);
                if (m.msg.content !== "none") profile.timezone = m.msg.content;
                try {
                    await m.msg.delete(); 
                } catch {/**/ }

                await ctx.send(await ctx.t("PROFILE_CREATE_LOCALE"));
                const m2 = await ctx.waitForMessage(async ctx => {
                    if (ctx.msg.content.toLowerCase() === "none") return true;
                    if (!Object.prototype.hasOwnProperty
                        .call(this.sosamba.i18n.languages, ctx.msg.content)) {
                        await ctx.msg.channel.createMessage(await ctx.t("INVALID_LOCALE"));
                        return false;
                    }
                    return true;
                }, 30000);
                if (m2.msg.content !== "none") profile.locale = m2.msg.content;
                try {
                    await m2.msg.delete(); 
                } catch {/**/ }
            }
            const toWrite = UserProfile.create(profile);
            await ctx.db.createUserProfile(toWrite);
            ctx._userProfile = new UserProfile(toWrite);
            await ctx.send(await ctx.t("PROFILE_CREATED"));
        } else if (action === TimezoneSymbol) {
            if (!arg) {
                await ctx.send(await ctx.t("PROFILE_TIMEZONE", (await ctx.userProfile).timezone));
            } else {
                if (!moment.tz.zone(arg)) {
                    await ctx.send(await ctx.t("INVALID_TIMEZONE"));
                    return;
                }
                const profile = await ctx.userProfile;
                profile.timezone = arg;
                await (ctx.userProfile = profile);
                await ctx.send(":ok_hand:");
            }
        } else if (action === LocaleSymbol) {
            if (!arg) {
                const status = this.calculateLocaleStatus();
                await ctx.send(await ctx.t("PROFILE_LOCALE_LIST", await ctx.userLanguage,
                    (await Promise.all(Object.keys(status).map(
                        async lang => `${lang} (${await this.sosamba.i18n.getTranslation("NATIVE_LOCALE_NAME", lang)}/${await this.sosamba.i18n.getTranslation("ENGLISH_LOCALE_NAME", lang)}) - ${status[lang]}%`
                    ))).join("\n")));
            } else {
                if (!Object.prototype.hasOwnProperty
                    .call(ctx.sosamba.i18n.languages, arg)) {
                    await ctx.send(await ctx.t("INVALID_LOCALE", arg));
                    return;
                }
                const profile = await ctx.userProfile;
                profile.locale = arg;
                await (ctx.userProfile = profile);
                await ctx.send(await ctx.t("LOCALE_SET",
                    `${arg} (${await ctx.t("NATIVE_LOCALE_NAME")}/${await ctx.t("ENGLISH_LOCALE_NAME")})`));
            }
        }
    }

    calculateLocaleStatus() {
        const s = {
            en: (100).toFixed(2)
        };
        const terms = Object.keys(this.sosamba.i18n.languages.en);
        for (const [language, translation] of Object.entries(this.sosamba.i18n.languages)) {
            if (!Object.prototype.hasOwnProperty
                .call(this.sosamba.i18n.languages, language)) continue;
            if (language === "en") continue;
            const termsInForeign = terms.filter(term => Object.prototype.hasOwnProperty
                .call(translation, term)).length;
            s[language] = (termsInForeign / terms.length * 100).toFixed(2);
        }
        return s;
    }
}

module.exports = ProfileCommand;