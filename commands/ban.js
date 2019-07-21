"use strict";
const { SwitchArgumentParser, Serializers: { User } } = require("sosamba");
const Command = require("../lib/ModCommand");

class BanCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "ban",
            argParser: new SwitchArgumentParser(sosamba, {
                user: {
                    type: User,
                    description: "the user to ban"
                },
                reason: {
                    type: String,
                    default: "No reason provided.",
                    description: "the optional reason for the ban"
                },
                soft: {
                    type: Boolean,
                    default: false,
                    description: "determines if this ban is a softban."
                }
            }),
            description: "Bans a user."
        });
    }
    async run(ctx, {user, reason, soft}) {
        if (this.sosamba.passesRoleHierarchy(ctx.member, user)) {
            await user.ban(1, `${bot.getTag(ctx.author)}: ${reason}`);
            if (soft) await user.unban();
            bot.modLog.addBan(user.id, ctx.msg, reason, soft);
            await ctx.send(await ctx.t(`${soft ? "SOFT": ""}BAN_DONE`, user));
        } else {
            ctx.send(await ctx.t("ROLE_HIERARCHY_ERROR"));
        }
    }
}

module.exports = BanCommand;