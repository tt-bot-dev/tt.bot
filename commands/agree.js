"use strict";
const { Command } = require("sosamba");
const dmReply = require("../util/sendReplyToDMs");

class AgreeCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: "agree",
            description: "If the server has set up the agreement feature, agrees to the server's rules.",
        });
    }
    async run(ctx) {
        const { memberRole, agreeChannel } = (await ctx.guildConfig || {});
        if (!memberRole || !agreeChannel) return;
        if (ctx.channel.id !== agreeChannel) return;
        if (!ctx.guild.roles.has(memberRole)) return;
        if (ctx.member.roles.includes(memberRole)) return;
        try {
            await ctx.member.addRole(memberRole, "Agreement to server's rules");
        } catch {
            try {
                await dmReply(ctx.author, await ctx.t("AGREE_FAULT", ctx.guild.members.get(ctx.guild.ownerID)));
            } catch {
                const m = await ctx.send(`${ctx.author.mention} ${await ctx.t("AGREE_FAULT", ctx.guild.members.get(ctx.guild.ownerID))}`);
                setTimeout(() => m.delete(), 5000);
            }
        }
        try {
            await ctx.msg.delete();
        } catch {
            return;
        }
    }
}

module.exports = AgreeCommand;