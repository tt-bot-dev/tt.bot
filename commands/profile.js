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
            if (!(await ctx.userProfile).fake) return ctx.send("you have a profile!");
            await ctx.send("Hello there! Would you like to set your profile up before I create one? Type y or yes if you want to, n or no if you don't. You have 10 seconds to answer.\n\nKeep in mind that you can still modify the values using other subcommands.");
            const { response, context } = await ctx.askYesNo(true);
            const profile = {
                id: ctx.author.id
            }

            if (response) {
                try { await context.msg.delete(); }
                catch {}
                await ctx.send("What is your timezone? This timezone should be a valid IANA timezone DB (check <https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List> for a list of them)\nYou have 30 seconds to answer. Type \"none\" if you don't want to set one yet.");
                const m = await ctx.waitForMessage(async ctx => {
                    if (ctx.msg.content.toLowerCase() === "none") return true;
                    if (!moment.tz.zone(ctx.msg.content)) {
                        await ctx.msg.channel.createMessage(await ctx.t("INVALID_TIMEZONE"));
                        return false;
                    }
                    return true;
                }, 30000)
                if (m.msg.content !== "none") profile.timezone = m.msg.content;
                try { await m.msg.delete(); }
                catch {}

                await ctx.send(`Which language do you speak? Here are the available languages: ${Object.keys(this.sosamba.i18n.languages).join(", ")}\nIn case it is not listed or don't want to set a language yet, type "none". You have 30 seconds to choose.\nYou can help us contributing languages on GitHub: <https://github.com/tt-bot-dev/languages>`);
                const m2 = await ctx.waitForMessage(async ctx => {
                    if (ctx.msg.content.toLowerCase() === "none") return true;
                    if (!this.sosamba.i18n.languages.hasOwnProperty(ctx.msg.content)) {
                        await ctx.msg.channel.createMessage(await ctx.t("INVALID_LOCALE"));
                        return false;
                    }
                    return true;
                }, 30000);
                if (m2.msg.content !== "none") profile.locale = m2.msg.content;
                try { await m2.msg.delete(); }
                catch {}
            }
            const toWrite = UserProfile.create(profile);
            await ctx.db.createUserProfile(toWrite);
            ctx._userProfile = new UserProfile(toWrite);
            await ctx.send(await ctx.t("PROFILE_CREATED"));
        } else if (action === TimezoneSymbol) {
            if (!arg) {
                await ctx.send(`Your current timezone is ${(await ctx.userProfile).timezone}.\nIn order to change it, provide a timezone as an argument.`)
            } else {
                if (!moment.tz.zone(arg)) {
                    await ctx.send(await ctx.t("INVALID_TIMEZONE"));
                    return;
                }
                const p = await ctx.userProfile;
                p.timezone = arg;
                await (ctx.userProfile = p);
                await ctx.send(":ok_hand:");
            }
        } else if (action === LocaleSymbol) {
            if (!arg) {
                const status = this.calculateLocaleStatus();
                await ctx.send(await ctx.t("PROFILE_LOCALE_LIST", await ctx.userLanguage, 
                (await Promise.all(Object.keys(status).map(
                    async k => `${k} (${await this.sosamba.i18n.getTranslation("NATIVE_LOCALE_NAME", k)}/${await this.sosamba.i18n.getTranslation("ENGLISH_LOCALE_NAME", k)}) - ${status[k]}%`
                ))).join("\n")));
            } else {
                if (!ctx.sosamba.i18n.languages.hasOwnProperty(arg)) {
                    await ctx.send(await ctx.t("INVALID_LOCALE", arg));
                    return;
                }
                const p = await ctx.userProfile;
                p.locale = arg;
                await (ctx.userProfile = p);
                await ctx.send(await ctx.t("LOCALE_SET",
                `${arg} (${await ctx.t("NATIVE_LOCALE_NAME")}/${await ctx.t("ENGLISH_LOCALE_NAME")})`))
            }
        }
    }

    calculateLocaleStatus() {
        const s = {
            en: (100).toFixed(2)
        };
        const terms = Object.keys(this.sosamba.i18n.languages.en);
        for (const [l, k] of Object.entries(this.sosamba.i18n.languages)) {
            if (!this.sosamba.i18n.languages.hasOwnProperty(l)) continue;
            if (l === "en") continue;
            const termsInForeign = terms.filter(l => k.hasOwnProperty(l)).length;
            s[l] = ((termsInForeign / terms.length) * 100).toFixed(2);
        }
        return s;
    }
}

module.exports = ProfileCommand;