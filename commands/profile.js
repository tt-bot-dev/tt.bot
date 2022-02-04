/**
 * Copyright (C) 2022 tt.bot dev team
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
const { Command, Eris: { Constants: { ApplicationCommandOptionTypes } } } = require("sosamba");
const UserProfile = require("../lib/Structures/UserProfile");
const RemoveSymbol = Symbol("tt.bot.profile.remove");
const SetupSymbol = Symbol("tt.bot.profile.setup");
const TimezoneSymbol = Symbol("tt.bot.profile.timezone");
const LocaleSymbol = Symbol("tt.bot.profile.locale");

class ProfileCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "profile",
            args: [
                {
                    name: "update",
                    description: "Updates your user profile (and creates one if you don't have one)",
                    type: ApplicationCommandOptionTypes.SUB_COMMAND,
                    options: [
                        {
                            name: "timezone",
                            description: "The timezone to use",
                            type: ApplicationCommandOptionTypes.STRING,
                            required: false,
                        }, {
                            name: "locale",
                            description: "The locale to use",
                            type: ApplicationCommandOptionTypes.STRING,
                            choices: ProfileCommand.getLocales(sosamba),
                            required: false
                        }
                    ]
                },
                {
                    name: "remove",
                    description: "Removes the user profile",
                    type: ApplicationCommandOptionTypes.SUB_COMMAND
                },
            ],
            description: "Manages the data we know about you."
        });
    }

    async run(ctx, [action, arg]) {
        return; // We haven't gotten to updating it yet

        //eslint-disable-next-line no-unreachable
        if (action === RemoveSymbol) {
            if ((await ctx.userProfile).fake) return ctx.send(await ctx.t("PROFILE_NONEXISTENT"));
            else {
                await this.sosamba.db.deleteUserProfile(ctx.author.id);
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
                } catch { /* */ }
                await ctx.send(await ctx.t("PROFILE_CREATE_TIMEZONE"));
                const m = await ctx.waitForMessage(async ctx => {
                    if (ctx.msg.content.toLowerCase() === "none") return true;
                    if (!this.isValidTz(ctx.msg.content)) {
                        await ctx.msg.channel.createMessage(await ctx.t("INVALID_TIMEZONE"));
                        return false;
                    }
                    return true;
                }, 30000);
                if (m.msg.content !== "none") profile.timezone = m.msg.content;
                try {
                    await m.msg.delete(); 
                } catch {/* */ }

                await ctx.send(await ctx.t("PROFILE_CREATE_LOCALE", {
                    languages: [...this.sosamba.localeManager.locales.keys()].join(", ")
                }));
                const m2 = await ctx.waitForMessage(async ctx => {
                    if (ctx.msg.content.toLowerCase() === "none") return true;
                    if (!ctx.sosamba.localeManager.locales.has( ctx.msg.content)) {
                        await ctx.msg.channel.createMessage(await ctx.t("INVALID_LOCALE"));
                        return false;
                    }
                    return true;
                }, 30000);
                if (m2.msg.content !== "none") profile.locale = m2.msg.content;
                try {
                    await m2.msg.delete(); 
                } catch {/* */ }
            }
            const toWrite = UserProfile.create(profile);
            await this.sosamba.db.createUserProfile(toWrite);
            ctx._userProfile = new UserProfile(toWrite);
            await ctx.send(await ctx.t("PROFILE_CREATED"));
        } else if (action === TimezoneSymbol) {
            if (!arg) {
                await ctx.send(await ctx.t("PROFILE_TIMEZONE", {
                    tz: (await ctx.userProfile).timezone
                }));
            } else {
                if (!this.isValidTz(arg)) {
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
                await ctx.send(await ctx.t("PROFILE_LOCALE_LIST", {
                    currentLocale: await ctx.userLanguage,
                    translationStatus: await Promise.all(Object.keys(status).map(
                        async lang => `${lang} (${await this.sosamba.localeManager.translate(lang, "NATIVE_LOCALE_NAME")}/${await this.sosamba.localeManager.translate(lang, "ENGLISH_LOCALE_NAME")}) - ${status[lang]}%`
                    )).join("\n")
                }));
            } else {
                if (!ctx.sosamba.localeManager.locales.has(arg)) {
                    await ctx.send(await ctx.t("INVALID_LOCALE", {
                        locale: arg,
                        languages: [...this.sosamba.localeManager.locales.keys()].join(", ")
                    }));
                    return;
                }
                const profile = await ctx.userProfile;
                profile.locale = arg;
                await (ctx.userProfile = profile);
                await ctx.send(await ctx.t("LOCALE_SET",
                    {
                        locale: `${arg} (${await ctx.t("NATIVE_LOCALE_NAME")}/${await ctx.t("ENGLISH_LOCALE_NAME")})`
                    }));
            }
        }
    }

    calculateLocaleStatus() {
        const s = {
            en: (100).toFixed(2)
        };
        const terms = Object.keys(this.sosamba.localeManager.locales.get("en").terms);
        for (const [language, { terms: translation }] of this.sosamba.localeManager.entries()) {
            if (language === "en") continue;
            const termsInForeign = terms.filter(term => Object.prototype.hasOwnProperty
                .call(translation, term)).length;
            s[language] = (termsInForeign / terms.length * 100).toFixed(2);
        }
        return s;
    }

    isValidTz(tz) {
        try {
            Intl.DateTimeFormat(void 0, { timeZone: tz });
            return true;
        } catch {
            return false;
        }
    }

    static getLocales(sosamba) {
        const terms = Object.keys(sosamba.localeManager.locales.get("en").terms);

        return sosamba.localeManager.locales.map(l => {
            const termsInForeign = terms.filter(term => Object.prototype.hasOwnProperty
                .call(l.terms, term)).length;
            return {
                name: `${l.terms.ENGLISH_LOCALE_NAME} (${l.terms.NATIVE_LOCALE_NAME}) \u2013 ${(termsInForeign / terms.length * 100).toFixed(2)}%`,
                value: l.id
            };
        });
    }
}

module.exports = ProfileCommand;
