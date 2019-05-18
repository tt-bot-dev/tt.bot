"use strict";
const { Command, SwitchArgumentParser } = require("sosamba");
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
                }
            })
        });
    }
    async run(ctx, {user, reason}) {
        if (this.sosamba.passesRoleHierarchy(ctx.member, user)) {
            await user.ban(1, `${bot.getTag(ctx.author)}: ${reason}`);
            bot.modLog.addBan(user.id, ctx.msg, reason, false);
            await ctx.send(ctx.t("BAN_DONE", user));
        } else {
            ctx.send(ctx.t("ROLE_HIERARCHY_ERROR"));
        }
    }
}

module.exports = BanCommand;