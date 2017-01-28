module.exports = (guild) => {
    bot.createMessage(guild.defaultChannel.id, `Thanks for adding me in the server!\nThe bot is in development, so expect bugs.\nOnce again, thank you for adding!\n-TTtie#4719`);
    bot.createMessage("274844715239866369", {
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
    bot.postStats().then(null, null);
}
module.exports.isEvent = true