"use strict";
const { SwitchArgumentParser, 
    Serializers: { Member } } = require("sosamba");
const Command = require("../lib/ModCommand");

class KickCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "kick",
            argParser: new SwitchArgumentParser(sosamba, {
                user: {
                    type: Member,
                    description: "The user to kick"
                },
                reason: {
                    type: String,
                    default: "No reason provided.",
                    description: "The reason for the kick"
                }
            }),
            description: "Kicks a user."
        });
    }

    async run(ctx, { user, reason }) {
        if (this.sosamba.passesRoleHierarchy(ctx.member, user)) {
            if (!this.sosamba.hasBotPermission(ctx.channel, "kickMembers")) return ctx.send(await ctx.t("ERROR", "I don't have the permissions to kick the user."));
            await user.kick(`${this.sosamba.getTag(ctx.author)}: ${reason}`);
            this.sosamba.modLog.addKick(user.id, ctx.msg, reason);
            await ctx.send(await ctx.t("KICK_DONE", user));
        } else {
            await ctx.send(await ctx.t("ROLE_HIERARCHY_ERROR"));
        }
    }
}

module.exports = KickCommand;