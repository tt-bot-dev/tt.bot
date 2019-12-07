"use strict";
const Command = require("../lib/commandTypes/ModCommand");
const { SwitchArgumentParser, Serializers: { Member } } = require("sosamba");
const UserProfile = require("../lib/Structures/UserProfile");

class StrikeCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "strike",
            description: "Strikes a user.",
            argParser: new SwitchArgumentParser(sosamba, {
                user: {
                    type: Member,
                    description: "the user to strike"
                },
                reason: {
                    type: String,
                    description: "the strike reason",
                    default: "No reason provided."
                }
            })
        });
    }

    async run(ctx, { user, reason }) {
        if (user.bot) return ctx.send(await ctx.t("BOTS_NOT_STRIKABLE"));
        await this.sosamba.modLog.addStrike(user.id, ctx, reason);
        const dm = await user.user.getDMChannel();
        const p = await ctx.db.getUserProfile(user.id);
        const prof = new UserProfile(p || {});
        try {
            await dm.createMessage({
                embed: {
                    title: await this.sosamba.i18n.getTranslation("YOU_GOT_STRIKED", prof.locale || "en"),
                    description: await this.sosamba.i18n.getTranslation("STRIKE_DETAILS", prof.locale || "en", this.sosamba.getTag(ctx.author), reason),
                    footer: {
                        text: await this.sosamba.i18n.getTranslation("PAY_ATTENTION", prof.locale || "en")
                    },
                    timestamp: new Date()
                }
            });
        } catch {/**/}
        await ctx.send(":ok_hand:");
    }
}

module.exports = StrikeCommand;
