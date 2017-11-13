module.exports = async (guild) => {
    if (guild.defaultChannel) bot.createMessage(guild.defaultChannel.id, `Thanks for adding me in the server!\nThe bot uses ${config.prefix} prefix. You can change it anytime using ${config.prefix}config command.\nHope I can service you well.\nWant to send any feedback? Use \`${config.prefix}feedback\` command. Please note that this command takes some info about you, do \`${config.prefix}help feedback\` to view what data do I collect.\nOnce again, thank you for adding!\n-TTtie#4900`);
    bot.createMessage("236757363699220480", {
        embed: {
            author: {
                name: `New server ${guild.name} (${guild.id})`,
                icon_url: guild.iconURL
            },
            description: `Has ${guild.memberCount} members.`,
            footer: {
                text: `Owned by ${bot.users.get(guild.ownerID).username}#${bot.users.get(guild.ownerID).discriminator}`,
                icon_url: bot.users.get(guild.ownerID).staticAvatarURL
            }
        }
    });
    if (bot.listBotColls().includes(guild)) return guild.leave();
    let blacklist = await db.table("blacklist").run();
    if (blacklist.find(fn=> {
        if (fn.id == guild.id) return true;
        if (fn.ownerID == guild.ownerID) return true;
    })) return guild.leave();
    bot.postStats().then(null, null);
    bot.postStats2().then(null, null);
};
module.exports.isEvent = true;
