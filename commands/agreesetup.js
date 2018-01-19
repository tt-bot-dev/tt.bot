module.exports = {
    exec: async function (msg) {
        const { agreeChannel, memberRole } = msg.guildConfig;
        if (agreeChannel && memberRole) {
            msg.channel.createMessage("The agree feature was already set up on this server. Do you want to disable it?\nType y or yes for disabling it. n or no otherwise. To respond, you have 10 seconds.");
            try {
                let [resp] = bot.waitForEvent("messageCreate", 10000, (m) => {
                    if (m.author.id != msg.author.id) return false;
                    if (m.channel.id != msg.channel.id) return false;
                    if (m.content.toLowerCase() != "y" || m.content.toLowerCase() != "yes" || m.content.toLowerCase() != "n" || m.content.toLowerCase() != "no") return false;
                    return true;
                });
                if (resp.content.toLowerCase() == "y" || resp.content.toLowerCase() == "yes") {
                    delete msg.guildConfig.agreeChannel;
                    delete msg.guildConfig.memberRole;
                    await db.table("configs").get(msg.guild.id).replace(msg.guildConfig);
                    msg.channel.createMessage("Done! The agree feature is now disabled.");
                } else {
                    msg.channel.createMessage("Operation cancelled.");
                }
            } catch (err) {
                if (err == "timeout") return msg.channel.createMessage("Operation cancelled.");
            }
        } else {
            // TODO: setting up 
        }
    },
    isCmd: true,
    display: true,
    category: 1,
    description: "Sets up the agree feature.",
};