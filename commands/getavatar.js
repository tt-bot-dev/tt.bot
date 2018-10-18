module.exports = {
    exec: function (msg, args) {
        userQuery(args || msg.author.id, msg, true).then(u => {
            bot.createMessage(msg.channel.id, {
                embed: {
                    author: {
                        name: `${u.nick ? u.nick : u.username} (${u.username}#${u.discriminator})'s avatar`,
                        icon_url: bot.user.staticAvatarURL
                    },
                    image: {
                        url: u.avatarURL
                    },
                    description: msg.t("AVATAR_NOT_LOADING", u.user.dynamicAvatarURL("png", 2048))
                }
            });
        }).catch(console.error);
    },
    isCmd: true,
    name: "getavatar",
    display: true,
    category: 1,
    description: "Get someone's avatar!"
};