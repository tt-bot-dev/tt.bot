module.exports = {
    exec: async function (msg) {
        const { agreeChannel, memberRole } = msg.guildConfig;
        if (agreeChannel && memberRole) {
            msg.channel.createMessage("The agreement feature was already set up on this server. Do you want to disable it?\nType y or yes for disabling it. n or no otherwise. To respond, you have 10 seconds.");
            try {
                let [resp] = await bot.waitForEvent("messageCreate", 10000, (m) => {
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
            msg.channel.createMessage("So, here we go! Please type your search query to choose the role you want to set up the agreement feature.");
            try {
                let [resp] = await bot.waitForEvent("messageCreate", 30000, (m) => {
                    if (m.author.id != msg.author.id) return false;
                    if (m.channel.id != msg.channel.id) return false;
                    return true;
                });
                let role;
                try {
                    role = await queries.role(msg, resp.content, true);
                } catch(err) {
                    return msg.channel.createMessage("Sorry, but I didn't get this right. Please rerun the command.");
                }
                msg.guildConfig.agreeChannel = msg.channel.id;
                msg.guildConfig.memberRole = role.id;
                await db.table("configs").get(msg.guild.id).update(msg.guildConfig);
                msg.channel.createMessage(`The setup is done! Now, when somebody types ${config.prefix}agree here, I'll give them the role.`);
            } catch (err) {
                if (err == "timeout") return msg.channel.createMessage("Operation cancelled.");
            }
        }
    },
    isCmd: true,
    display: true,
    category: 1,
    description: "Sets up the agreement feature.",
};