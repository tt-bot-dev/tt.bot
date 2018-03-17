module.exports = {
    isCmd: true,
    exec: function (msg) {
        function getGuildVerification() {
            switch (msg.guild.verificationLevel) {
            case 0:
                return "None";
                
            case 1:
                return "Low (Requires verified email)";
                
            case 2:
                return "Medium (Requires verified email and being registered on Discord for more than 5 minutes)";
                
            case 3:
                return "(╯°□°）╯︵ ┻━┻ (Requires verified email, being registered on Discord for more than 5 minutes and being on the server for more than 10 minutes)";
                
            case 4:
                return "┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻ (Requires verified phone)";
            }
        }
        function getExplicitContent() {
            switch (msg.guild.explicitContentFilter) {
            case 0:
                return "Off";
                
            case 1:
                return "On for people without any role";
                
            case 2:
                return "On for all";
                
            }
        }
        let embed = {
            author: {
                name: `Server info for ${msg.guild.name}`
            },
            thumbnail: {
                url: msg.guild.iconURL
            },
            fields: [
                {
                    name: "Members",
                    value: `${msg.guild.memberCount} members`,
                    inline: true
                },
                {
                    name: "Owner",
                    value: bot.getTag(msg.guild.members.get(msg.guild.ownerID)),
                    inline: true
                }, {
                    name: "Guild verification",
                    value: getGuildVerification(),
                    inline: true
                }, {
                    name: "Requires admin 2FA",
                    value: msg.guild.mfaLevel == 1 ? "Yes" : "No",
                    inline: true
                }, {
                    name: "Roles",
                    value: `${msg.guild.roles.size} roles`,
                    inline: true
                }, {
                    name: "Explicit content filtering",
                    value: getExplicitContent(),
                    inline: true
                }, {
                    name: "Default notification setting",
                    value: msg.guild.defaultNotifications == 1 ? "Only @mentions" : "All messages",
                    inline: true
                }
            ],
            description: `
**ID**: ${msg.guild.id}
**Voice region**: ${msg.guild.region}
**AFK timeout**: ${msg.guild.afkTimeout / 60} minutes`,
            image: {
                url: `https://cdn.discordapp.com/splashes/${msg.guild.id}/${msg.guild.splash}`
            },
            footer: {
                text: "Created at"
            },
            timestamp: new Date(msg.guild.createdAt),
            color: 0x008800
        };
        if (msg.guild.afkChannelID) embed.fields.push({
            name: "AFK channel name",
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