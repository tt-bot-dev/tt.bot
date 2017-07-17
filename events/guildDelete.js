module.exports = (guild) => {
    bot.createMessage("236757363699220480", {
        embed: {
            author: {
                name: `Bot was removed from ${guild.name} (${guild.id})`,
                icon_url: guild.iconURL
            },
            description: `Had ${guild.memberCount} members.`,
            footer: {
                text: `Owned by ${bot.users.get(guild.ownerID).username}#${bot.users.get(guild.ownerID).discriminator}`,
                icon_url: bot.users.get(guild.ownerID).staticAvatarURL
            }
        }
    });
    
    bot.postStats().then(null, null);
    bot.postStats2().then(null, null);
};
module.exports.isEvent = true;