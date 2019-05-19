"use strict";
const { SwitchArgumentParser } = require("sosamba");
const Command = require("../lib/ModCommand");
const { User } = require("eris");

class BanCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "ban",
            args: "<user:User>",
            argParser: new SwitchArgumentParser(sosamba, {
                user: {
                    type: User,
                },
                reason: {
                    type: String,
                    default: "No reason provided."
                },
                soft: {
                    type: Boolean,
                    default: false
                }
            })
        });
    }
    async run(ctx, {user, reason, soft}) {
        if (this.sosamba.passesRoleHierarchy(ctx.member, user)) {
            await user.ban(1, `${bot.getTag(ctx.author)}: ${reason}`);
            if (soft) await user.unban();
            bot.modLog.addBan(user.id, ctx.msg, reason, soft);
            await ctx.send(ctx.t(`${soft ? "SOFT": ""}BAN_DONE`, user));
        } else {
            ctx.send(ctx.t("ROLE_HIERARCHY_ERROR"));
        }
    }
}

module.exports = BanCommand;