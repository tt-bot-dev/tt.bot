module.exports = {
    exec: async function (msg, args) {
        const { logChannel, logEvents } = msg.guildConfig;
        if (logChannel && logEvents) {
            msg.channel.createMessage("The logging feature was already set up on this server. Do you want to disable it?\nType y or yes for disabling it. n or no otherwise. To respond, you have 10 seconds.");
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
                    msg.channel.createMessage("Done! The logging feature is now disabled.");
                } else {
                    msg.channel.createMessage("Operation cancelled.");
                }
            } catch (err) {
                if (err == "timeout") return msg.channel.createMessage("Operation cancelled.");
            }
        } else {
            if (!args) return msg.channel.createMessage("Please supply the events that I should log, separated by a semicolon (;)");
            msg.guildConfig.logChannel = msg.channel.id;
            msg.guildConfig.logEvents = args;
            await db.table("configs").get(msg.guild.id).update(msg.guildConfig);
            msg.channel.createMessage("The setup is done! Now, when one of the specified events trigger, I'll send them here.");
        }
    },
    isCmd: true,
    display: true,
    category: 4,
    description: "Sets up the logging feature.",
    args: "<events, separated by a semicolon (;)>",
    aliases: ["logs"]
};