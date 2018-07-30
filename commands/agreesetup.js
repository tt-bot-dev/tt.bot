module.exports = {
    exec: async function (msg) {
        const { agreeChannel, memberRole } = msg.guildConfig;
        if (agreeChannel && memberRole) {
            msg.channel.createMessage(msg.t("AGREE_SETUP_ALREADY"));
            try {
                let [resp] = await bot.waitForEvent("messageCreate", 10000, (m) => {
                    if (m.author.id != msg.author.id) return false;
                    if (m.channel.id != msg.channel.id) return false;
                    if (m.content.toLowerCase() != "y" && m.content.toLowerCase() != "yes" && m.content.toLowerCase() != "n" && m.content.toLowerCase() != "no") return false;
                    return true;
                });
                if (resp.content.toLowerCase() == "y" || resp.content.toLowerCase() == "yes") {
                    delete msg.guildConfig.agreeChannel;
                    delete msg.guildConfig.memberRole;
                    await db.table("configs").get(msg.guild.id).replace(msg.guildConfig);
                    msg.channel.createMessage(msg.t("AGREE_DISABLED"));
                } else {
                    msg.channel.createMessage(msg.t("OP_CANCELLED"));
                }
            } catch (err) {
                if (err == "timeout") return msg.channel.createMessage(msg.t("OP_CANCELLED"));
            }
        } else {
            msg.channel.createMessage(msg.t("AGREE_ROLE_QUERY"));
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
                    return msg.channel.createMessage(msg.t("COMMAND_ERROR"));
                }
                msg.guildConfig.agreeChannel = msg.channel.id;
                msg.guildConfig.memberRole = role.id;
                await db.table("configs").get(msg.guild.id).update(msg.guildConfig);
                msg.channel.createMessage(msg.t("AGREE_SETUP", config.prefix));
            } catch (err) {
                if (err == "timeout") return msg.channel.createMessage(msg.t("OP_CANCELLED"));
            }
        }
    },
    isCmd: true,
    display: true,
    category: 4,
    description: "Sets up the agreement feature."
};