module.exports = {
    exec: async function (msg, args) {
        if (!msg.guildConfig) return msg.channel.createMessage(`Please create a config using ${config.prefix}config command before proceeding.`)
        msg.guildConfig.modlogChannel = msg.channel.id;
        await db.table("configs").get(msg.guild.id).update(msg.guildConfig)
        msg.channel.createMessage(":ok_hand: I'll send modlog messages here.")
    },
    isCmd: true,
    display: true,
    category: 4,
    description: "Sets the current channel as modlog channel."
};