const dmReply = require("../util/sendReplyToDMs");
const errString = (owner) => `Sorry, but I'm not able to give you the role. Please tell the server owner (${bot.getTag(owner)}) about this.`;
module.exports = {
    exec: async function (msg) {
        const {agreeChannel, memberRole} = msg.guildConfig;
        if (!agreeChannel || !memberRole) return;
        if (msg.channel.id !== agreeChannel) return;
        if (!msg.guild.roles.get(memberRole)) return;
        if (msg.member.roles.includes(memberRole)) return;
        try {
            await msg.member.addRole(memberRole, "Agreement to server's rules");
        } catch(_) {
            try {
                await dmReply(msg.author, errString(msg.guild.members.get(msg.guild.ownerID)));
            } catch(_) {
                let m = await msg.channel.createMessage(`${msg.author.mention} ${errString(msg.guild.members.get(msg.guild.ownerID))}`);
                setTimeout(() => m.delete(), 5000);
            }
        }
        try {
            await msg.delete();
        } catch(_) {
            return;
        }
    },
    isCmd: true,
    display: true,
    category: 1,
    description: "If the server has set agree feature, agrees to the server's rules.",
};