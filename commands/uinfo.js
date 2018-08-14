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
                if (!m.game) return msg.t("PLAYING");
                switch (m.game.type) {
                case 0:
                    return msg.t("PLAYING");
                case 1:
                    return msg.t("STREAMING");
                case 2:
                    return msg.t("LISTENING_TO");
                }
            }
            function getstatus() {
                switch (s) {
                case "online":
                    return msg.t("ONLINE");
                case "idle":
                    return msg.t("IDLE");
                case "dnd":
                    return msg.t("DND");
                case "offline":
                    return msg.t("OFFLINE");
                }
            }
            bot.createMessage(msg.channel.id, {
                embed: {
                    author: {
                        icon_url: m.staticAvatarURL,
                        name: msg.t("USER_INFO",`${unick} ${unick == bot.getTag(m) ? "" : `(${bot.getTag(m)})`} (${m.id}) ${m.bot ? "(BOT)" : ""}`)
                    },
                    thumbnail: {
                        url: m.user.avatarURL
                    },
                    fields: [{
                        name: getStatusType(),
                        value: (() => {
                            if (!m.game) return msg.t("PLAYING_NONE");
                            let str = "";
                            str += m.game.name + "\n";
                            if (m.game.details) str += m.game.details + "\n";
                            if (m.game.state) str += m.game.state;
                            return str.trim() || msg.t("SPACE_UNIVERSE");
                        })(),
                        inline: true
                    }, {
                        name: msg.t("STATUS"),
                        value: getstatus(),
                        inline: true
                    }, {
                        name: msg.t("ROLES"),
                        value: rarr.join(", ").length > 1024 ? msg.t("TOOLONG") : rarr.join(", "),
                        inline: true
                    }, {
                        name: msg.t("CREATED_ON"),
                        value: (msg.userProfile && msg.userProfile.timezone) ? 
                            moment(new Date(m.createdAt)).tz(msg.userProfile.timezone).format(config.tzDateFormat) :
                            moment(new Date(m.createdAt)).format(config.normalDateFormat),
                        inline: true
                    }, {
                        name: msg.t("CURRENT_VOICE"),
                        value: m.voiceState.channelID ? msg.guild.channels.get(m.voiceState.channelID).name : msg.t("NONE"),
                        inline: true
                    }],
                    timestamp: new Date(m.joinedAt),
                    footer: {
                        text: msg.t("JOINED_ON")
                    }
                }
            });
        }
        else {
            const u = bot.users.get(args) || await bot.getUserWithoutRESTMode(args);
            msg.channel.createMessage({
                embed: {
                    author: {
                        icon_url: u.avatarURL,
                        name: msg.t("USER_INFO",`${bot.getTag(u)} (${u.id}) ${u.bot ? "(BOT)" : ""}`, true)
                    },
                    thumbnail: {
                        url: u.avatarURL
                    },
                    fields: [{
                        name: msg.t("CREATED_ON"),
                        value: (msg.userProfile && msg.userProfile.timezone) ? 
                            moment(new Date(u.createdAt)).tz(msg.userProfile.timezone).format(config.tzDateFormat) : 
                            moment(new Date(u.createdAt)).format(config.normalDateFormat),
                        inline: true
                    }]
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