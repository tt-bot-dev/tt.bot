module.exports = {
    exec: async function (msg, args) {
        if (!msg.guildConfig) return msg.channel.createMessage(`Please create a config using ${config.prefix}config command before proceeding.`)
        if (args.toLowerCase() == "remove") {
            if (!msg.guildConfig.modlogChannel) return msg.channel.createMessage(`You don't have a modlog channel set.`)
            delete msg.guildConfig.modlogChannel
            await db.table("configs").get(msg.guild.id).replace(msg.guildConfig).run()
            msg.channel.createMessage(":ok_hand: Removed the modlog channel")
            return
        }
        
        msg.guildConfig.modlogChannel = msg.channel.id;
        await db.table("configs").get(msg.guild.id).update(msg.guildConfig).run()
        msg.channel.createMessage(":ok_hand: I'll send modlog messages here.")
    },
    isCmd: true,
    display: true,
    category: 4,
    description: "Sets the current channel as modlog channel.",
    args: "[remove]"
};