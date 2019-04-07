const { Command } = require("sosamba");
const dmReply = require("../util/sendReplyToDMs");

class AgreeCommand extends Command {
    async run(ctx) {
        const { memberRole, agreeChannel } = await ctx.guildConfig;
        if (!memberRole || !agreeChannel) return;
        if (ctx.channel.id !== agreeChannel) return;
        if (!ctx.guild.roles.has(memberRole)) return;
        if (ctx.member.roles.includes(memberRole)) return;
        try {
            await ctx.member.addRole(memberRole, "Agreement to server's rules");
        } catch {
            try {
                await dmReply(ctx.author, "cannot give you the role :(")
            } catch {
                const m = await ctx.send(`${msg.author.mention} cannot give you the role :(`)
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