module.exports = {
    isCmd: true,
    exec: function (msg) {
        function getGuildVerification() {
            switch (msg.guild.verificationLevel) {
            case 0:
                return msg.t("GUILD_VERIFICATION_NONE");
                
            case 1:
                return msg.t("GUILD_VERIFICATION_LOW");
                
            case 2:
                return msg.t("GUILD_VERIFICATION_MEDIUM");
                
            case 3:
                return "(╯°□°）╯︵ ┻━┻" + msg.t("GUILD_VERIFICATION_TABLEFLIP");
                
            case 4:
                return "┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻" + msg.t("GUILD_VERIFICATION_ULTRATABLEFLIP");
            }
        }
        function getExplicitContent() {
            switch (msg.guild.explicitContentFilter) {
            case 0:
                return msg.t("EXPLICIT_FILTERING_OFF");
                
            case 1:
                return msg.t("EXPLICIT_FILTERING_NOROLE");
                
            case 2:
                return msg.t("EXPLICIT_FILTERING_ALL");
                
            }
        }
        let embed = {
            author: {
                name: `${msg.guild.name}`
            },
            thumbnail: {
                url: msg.guild.iconURL
            },
            fields: [
                {
                    name: msg.t("MEMBERS"),
                    value: msg.t("MEMBER_COUNT", msg.guild.memberCount),
                    inline: true
                },
                {
                    name: msg.t("OWNER"),
                    value: bot.getTag(msg.guild.members.get(msg.guild.ownerID)),
                    inline: true
                }, {
                    name: msg.t("GUILD_VERIFICATION_LEVEL"),
                    value: getGuildVerification(),
                    inline: true
                }, {
                    name: msg.t("REQUIRES_ADMIN_MFA"),
                    value: msg.guild.mfaLevel == 1 ? msg.t("YES") : msg.t("NO"),
                    inline: true
                }, {
                    name: msg.t("ROLES"),
                    value: msg.t("ROLE_COUNT", msg.guild.roles.size),
                    inline: true
                }, {
                    name: msg.t("EXPLICIT_FILTERING"),
                    value: getExplicitContent(),
                    inline: true
                }, {
                    name: msg.t("DEFAULT_NOTIFICATIONS"),
                    value: msg.guild.defaultNotifications == 1 ? msg.t("ONLY_MENTIONS") : msg.t("ALL_MESSAGES"),
                    inline: true
                }
            ],
            description: `
**ID**: ${msg.guild.id}
**${msg.t("VOICE_REGION")}**: ${msg.guild.region}
**${msg.t("AFK_TIMEOUT")}**: ${msg.t("AFK_MINUTES", msg.guild.afkTimeout)}`,
            image: {
                url: `https://cdn.discordapp.com/splashes/${msg.guild.id}/${msg.guild.splash}`
            },
            footer: {
                text: msg.t("CREATED_ON")
            },
            timestamp: new Date(msg.guild.createdAt),
            color: 0x008800
        };
        if (msg.guild.afkChannelID) embed.fields.push({
            name: msg.t("AFK_CHANNEL"),
            value: msg.guild.channels.get(msg.guild.afkChannelID).name,
            inline:true
        });
        msg.channel.createMessage({
            embed
        });
    },
    category: 1,
    description: "Display the server info.",
    display: true
};