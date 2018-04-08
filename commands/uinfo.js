module.exports = {
    exec: async function (msg, args) {
        let u = args != "" ? args : msg.author.id;
        const isUid = /^\d{17,19}$/.test(args);
        if (!isUid || (isUid && msg.guild.members.get(args))) {
            const m = await userQuery(u, msg, true);
            let rarr = m.roles.map(r => m.guild.roles.get(r).name);
            rarr.unshift("@everyone");
            let unick = m.nick || bot.getTag(m);
            let s = m.status;
            function getStatusType() {
                if (!m.game) return "Playing";
                switch (m.game.type) {
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
                        icon_url: m.staticAvatarURL,
                        name: `Info for ${unick} ${unick == bot.getTag(m) ? "" : `(${bot.getTag(m)})`} (${m.id}) ${m.bot ? "(BOT)" : ""}`
                    },
                    thumbnail: {
                        url: m.user.avatarURL
                    },
                    fields: [{
                        name: getStatusType(),
                        value: (() => {
                            if (!m.game) return "Nothing";
                            let str = "";
                            str += m.game.name + "\n";
                            if (m.game.details) str += m.game.details + "\n";
                            if (m.game.state) str += m.game.state;
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
                        name: "Created on",
                        value: (msg.userProfile && msg.userProfile.timezone) ? 
                            moment(new Date(m.createdAt)).tz(msg.userProfile.timezone).format(config.tzDateFormat) :
                            moment(new Date(m.createdAt)).format(config.normalDateFormat),
                        inline: true
                    }, {
                        name: "Is in a voice channel?",
                        value: m.voiceState.channelID ? "yes" : "no",
                        inline: true
                    }],
                    timestamp: new Date(m.joinedAt),
                    footer: {
                        text: "Joined on"
                    }
                }
            });
        }
        else {
            const u = await bot.getUserWithoutRESTMode(args);
            msg.channel.createMessage({
                embed: {
                    author: {
                        icon_url: u.avatarURL,
                        name: `Limited info for ${bot.getTag(u)} (${u.id}) ${u.bot ? "(BOT)" : ""}`
                    },
                    thumbnail: {
                        url: u.avatarURL
                    },
                    fields: [{
                        name: "Created on",
                        value: (msg.userProfile && msg.userProfile.timezone) ? 
                            moment(new Date(u.createdAt)).tz(msg.userProfile.timezone).format(config.tzDateFormat) : 
                            moment(new Date(u.createdAt)).format(config.normalDateFormat),
                        inline: true
                    }],
                    footer: {
                        text: "This is all I can provide. Sorry for that."
                    }
                }
            });
        }
    },
    isCmd: true,
    name: "uinfo",
    display: true,
    category: 1,
    description: "User information.",
    aliases: ["userinfo"]

};