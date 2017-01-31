module.exports = {
    exec: function (msg, args) {
        let u = args != "" ? args : msg.author.id;
        userQuery(u, msg).then(u => {
            let s = u.status;
            function getstatus() {
                switch (s) {
                case "online":
                    return "Online";
                    break;
                case "idle":
                    return "Idle";
                    break;
                case "dnd":
                    return "Do not disturb"
                    break;
                case "offline":
                    return "Invisible/offline"
                    break;
                }
            }
            bot.createMessage(msg.channel.id, {
                embed: {
                    author: {
                        icon_url: bot.user.staticAvatarURL,
                        name: `Info for ${u.nick ? u.nick : u.username} (${u.username}#${u.discriminator}) (${u.id}) ${u.bot ? "(BOT)" : "(not a bot)"}`
                    },
                    thumbnail: {
                        url: u.user.staticAvatarURL
                    },
                    fields: [{
                        name: "Playing",
                        value: u.game ? u.game.name : "Nothing",
                        inline: true
                    }, {
                        name: "Status",
                        value: getstatus(),
                        inline: true
                    }],
                    timestamp: new Date(u.joinedAt)
                }
            })
        }).catch(console.error)
    },
    isCmd: true,
    name: "uinfo",
    display: true,
    category: 1,
    description: "User information."
}