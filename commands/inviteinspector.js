module.exports = {
    exec: async function (msg, args) {
        let inviteData;
        try {
            inviteData = await bot.getInvite(args, true);
        } catch (err) {
            return msg.channel.createMessage({
                embed: {
                    color: 0x880000,
                    author: {
                        name: msg.t("OOPS")
                    },
                    description: msg.t("CANNOT_GET_INVITE"),
                    footer: {
                        text: msg.t("INVITE_ERR_FOOTER")   
                    }
                }
            });
        }
        msg.channel.createMessage({
                embed: {
                    color: 0x008800,
                    author: {
                        name: inviteData.guild.name,
                        icon_url: inviteData.guild.icon ? `https://cdn.discordapp.com/icons/${inviteData.guild.id}/${inviteData.guild.icon}.png` : null
                    },
                    fields: [{
                        name: msg.t("INV_CHANNEL_TYPE"),
                        value: msg.t("INV_CHANNEL_TYPE_VAL", inviteData.channel.type, inviteData.channel.name),
                        inline: true
                    }, {
                        name: msg.t("INV_GUILD_ID"),
                        value: inviteData.guild.id,
                        inline: true
                    }, {
                        name: msg.t("MEMBERS"),
                        value: msg.t("INV_MEMBERS_VAL", inviteData.memberCount, inviteData.presenceCount),
                        inline: true
                    }, {
                        name: msg.t("INV_JOIN"),
                        value: msg.t("INV_JOIN_LINK",inviteData.code),
                        inline: true
                    }],
                    footer: inviteData.inviter ? {
                        text: msg.t("INV_INVITER", bot.getTag(inviteData.inviter)),
                        icon_url: inviteData.avatarURL
                    } : null
                }
            });
    },
    isCmd: true,
    display: true,
    category: 1,
    description: "~~Spy~~ Get information on the invites",
    args: "<invite code>",
    aliases: [
        "iinspector"
    ]
};