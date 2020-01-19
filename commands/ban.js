"use strict";
const { SwitchArgumentParser, Serializers: { Member } } = require("sosamba");
const Command = require("../lib/commandTypes/ModCommand");

class BanCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "ban",
            argParser: new SwitchArgumentParser(sosamba, {
                user: {
                    type: Member,
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

    async permissionCheck(ctx) {
        return ctx.member.permission.has("banMembers") || await super.permissionCheck(ctx);
    }

    async run(ctx, {user, reason, soft}) {
        if (this.sosamba.passesRoleHierarchy(ctx.member, user)) {
            await ctx.guild.banMember(user.id, 1, `${this.sosamba.getTag(ctx.author)}: ${reason}`);
            if (soft) await ctx.guild.unbanMember(user.id);
            this.sosamba.modLog.addBan(user.id, ctx, reason, soft);
            await ctx.send(await ctx.t(`${soft ? "SOFT": ""}BAN_DONE`, user.user));
        } else {
            ctx.send(await ctx.t("ROLE_HIERARCHY_ERROR"));
        }
    }
}

module.exports = BanCommand;