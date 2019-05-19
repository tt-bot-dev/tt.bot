const { SwitchArgumentParser } = require("sosamba");
const Command = require("../lib/ModCommand");
const { Member } = require("eris");

class KickCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "kick",
            argParser: new SwitchArgumentParser(sosamba, {
                user: {
                    type: Member
                },
                reason: {
                    type: String,
                    default: "no reason"
                }
            })
        });
    }

    async run(ctx, { user, reason }) {
        if (this.sosamba.passesRoleHierarchy(ctx.member, user)) {
            if (!this.sosamba.hasBotPermission(ctx.channel, "kickMembers")) return ctx.send(ctx.t("ERROR", "I don't have the permissions to kick the user."));
            await user.kick(`${this.sosamba.getTag(ctx.author)}: ${reason}`);
            this.sosamba.modLog.addKick(user.id, ctx.msg, reason);
            await ctx.send(ctx.t("KICK_DONE", user));
        } else {
            await ctx.send(ctx.t("ROLE_HIERARCHY_ERROR"));
        }
    }
}

module.exports = KickCommand;