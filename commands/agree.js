module.exports = {
    exec: async function (msg) {
        const {agreeChannel, memberRole} = msg.guildConfig;
        if (!agreeChannel || !memberRole) return;
        if (msg.channel.id !== agreeChannel) return;
        if (!msg.guild.roles.get(memberRole)) return;
        await msg.member.addRole(memberRole, "Agreement to server's rules");
    },
    isCmd: true,
    display: true,
    category: 1,
    description: "If the server has set agree feature, agrees to the server's rules.",
};