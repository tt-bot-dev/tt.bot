module.exports = {
    exec: function (msg, args) {
        let u = args != "" ? args : msg.author.id;
        userQuery(u, msg).then(u => {
            bot.createMessage(msg.channel.id, {
                embed: {
                    author: {
                        name: `${u.nick ? u.nick : u.username} (${u.username}#${u.discriminator})'s avatar`,
                        icon_url: bot.user.staticAvatarURL
                    },
                    image: {
                        url: u.avatarURL
                    },
                    description: `[Image not loading?](${u.avatarURL})`
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