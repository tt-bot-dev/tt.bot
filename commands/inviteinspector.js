const { Command } = require("sosamba");

class InviteInspectorCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: "inviteinspector",
            args: "<invite code>"
        })
    }

    async run(ctx, args) {
        let inviteData;
        try {
            inviteData = await this.sosamba.getInvite(args, true);
        } catch {
            return ctx.send({
                embed: {
                    color: 0x880000,
                    author: {
                        name: ctx.t("OOPS")
                    },
                    description: ctx.t("CANNOT_GET_INVITE"),
                    footer: {
                        text: ctx.t("INVITE_ERR_FOOTER")   
                    }
                }
            });
        }
        ctx.send({
            embed: {
                color: 0x008800,
                author: {
                    name: inviteData.guild.name,
                    icon_url: inviteData.guild.icon ? `https://cdn.discordapp.com/icons/${inviteData.guild.id}/${inviteData.guild.icon}.png` : null
                },
                fields: [{
                    name: ctx.t("INV_CHANNEL_TYPE"),
                    value: ctx.t("INV_CHANNEL_TYPE_VAL", inviteData.channel.type, inviteData.channel.name),
                    inline: true
                }, {
                    name: ctx.t("INV_GUILD_ID"),
                    value: inviteData.guild.id,
                    inline: true
                }, {
                    name: ctx.t("MEMBERS"),
                    value: ctx.t("INV_MEMBERS_VAL", inviteData.memberCount, inviteData.presenceCount),
                    inline: true
                }, {
                    name: ctx.t("INV_JOIN"),
                    value: ctx.t("INV_JOIN_LINK",inviteData.code),
                    inline: true
                }],
                footer: inviteData.inviter ? {
                    text: ctx.t("INV_INVITER", bot.getTag(inviteData.inviter)),
                    icon_url: inviteData.avatarURL
                } : null
            }
        });
    }
}

module.exports = InviteInspectorCommand;