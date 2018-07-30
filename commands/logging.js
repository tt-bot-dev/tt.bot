module.exports = {
    exec: async function (msg, args) {
        const { logChannel, logEvents } = msg.guildConfig;
        if (logChannel && logEvents) {
            msg.channel.createMessage(msg.t("LOGGING_ALREADY_SETUP"));
            try {
                let [resp] = await bot.waitForEvent("messageCreate", 10000, (m) => {
                    if (m.author.id != msg.author.id) return false;
                    if (m.channel.id != msg.channel.id) return false;
                    if (m.content.toLowerCase() != "y" && m.content.toLowerCase() != "yes" && m.content.toLowerCase() != "n" && m.content.toLowerCase() != "no") return false;
                    return true;
                });
                if (resp.content.toLowerCase() == "y" || resp.content.toLowerCase() == "yes") {
                    delete msg.guildConfig.logChannel;
                    delete msg.guildConfig.logEvents;
                    await db.table("configs").get(msg.guild.id).replace(msg.guildConfig);
                    msg.channel.createMessage(msg.t("LOGGING_DISABLED"));
                } else {
                    msg.channel.createMessage(msg.t("OP_CANCELLED"));
                }
            } catch (err) {
                if (err == "timeout") return msg.channel.createMessage(msg.t("OP_CANCELLED"));
            }
        } else {
            if (!args) return msg.channel.createMessage(msg.t("ARGS_MISSING"));
            msg.guildConfig.logChannel = msg.channel.id;
            msg.guildConfig.logEvents = args;
            await db.table("configs").get(msg.guild.id).update(msg.guildConfig);
            msg.channel.createMessage(msg.t("LOGGING_SETUP"));
        }
    },
    isCmd: true,
    display: true,
    category: 4,
    description: "Sets up the logging feature.",
    args: "<events, separated by a semicolon (;)>",
    aliases: ["logs"]
};