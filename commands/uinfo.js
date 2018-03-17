module.exports = {
    exec: function (msg, args) {
        let u = args != "" ? args : msg.author.id;
        userQuery(u, msg, true).then(u => {
            let rarr = u.roles.map(r => u.guild.roles.get(r).name);
            rarr.unshift("@everyone");
            let unick = u.nick || bot.getTag(u);
            let s = u.status;
            function getStatusType() {
                if (!u.game) return "Playing";
                switch (u.game.type) {
                case 0:
                    return "Playing";
                case 1:
                    return "Streaming";
                case 2:
                    return "Listening to";
                }
            }
            function getstatus() {
                switch (s) {
                case "online":
                    return "Online";
                case "idle":
                    return "Idle";
                case "dnd":
                    return "Do not disturb";
                case "offline":
                    return "Invisible/offline";
                }
            }
            bot.createMessage(msg.channel.id, {
                embed: {
                    author: {
                        icon_url: u.staticAvatarURL,
                        name: `Info for ${unick} ${unick == bot.getTag(u) ? "" : `(${u.username}#${u.discriminator})`} (${u.id}) ${u.bot ? "(BOT)" : ""}`
                    },
                    thumbnail: {
                        url: u.user.staticAvatarURL
                    },
                    fields: [{
                        name: getStatusType(),
                        value: (() => {
                            if (!u.game) return "Nothing";
                            let str;
                            str += u.game.name + "\n";
                            if (u.game.details) str += u.game.details + "\n";
                            if (u.game.state) str += u.game.state;
                            return str.trim() || "with an universe of spaces.\nGood luck, you found an easter egg :eyes:";
                        })(),
                        inline: true
                    }, {
                        name: "Status",
                        value: getstatus(),
                        inline: true
                    }, {
                        name: "Roles",
                        value: rarr.join(", ").length > 2048 ? "Too long to show ;-;" : rarr.join(", "),
                        inline: true
                    }, {
                        name: "Created at",
                        value: (msg.userProfile && msg.userProfile.timezone) ? moment(new Date(u.createdAt)).tz(msg.userProfile.timezone).format(config.tzDateFormat) : moment(new Date(u.createdAt)).format(config.normalDateFormat),
                        inline: true
                    }, {
                        name: "Is in a voice channel?",
                        value: u.voiceState.channelID ? "yes" : "no",
                        inline: true
                    }],
                    timestamp: new Date(u.joinedAt)
                }
            });
        }).catch(console.error);
    },
    isCmd: true,
    name: "uinfo",
    display: true,
    category: 1,
    description: "User information.",
    aliases: ["userinfo"]

};