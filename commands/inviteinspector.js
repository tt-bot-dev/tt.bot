"use strict";
const { Command } = require("sosamba");

class InviteInspectorCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: "inviteinspector",
            args: "<invite code>",
            description: "Gets information about an invite."
        });
    }

    async run(ctx, args) {
        let inviteData;
        try {
            inviteData = await this.sosamba.getInvite(args, true);
        } catch (err) {
            if (err.code === 40007) {
                return ctx.send({
                    embed: {
                        color: 0xFF0000,
                        author: {
                            name: await ctx.t("OOPS")
                        },
                        description: "I cannot get the information about the invite because I'm banned from there.",
                        footer: {
                            text: "Please contact the invite authors to unban me and try again."
                        }
                    }
                });
            }
            return ctx.send({
                embed: {
                    color: 0xFF0000,
                    author: {
                        name: await ctx.t("OOPS")
                    },
                    description: await ctx.t("CANNOT_GET_INVITE"),
                    footer: {
                        text: await ctx.t("INVITE_ERR_FOOTER")   
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
                    name: await ctx.t("INV_CHANNEL_TYPE"),
                    value: await ctx.t("INV_CHANNEL_TYPE_VAL", inviteData.channel.type, inviteData.channel.name),
                    inline: true
                }, {
                    name: await ctx.t("INV_GUILD_ID"),
                    value: inviteData.guild.id,
                    inline: true
                }, {
                    name: await ctx.t("MEMBERS"),
                    value: await ctx.t("INV_MEMBERS_VAL", inviteData.memberCount, inviteData.presenceCount),
                    inline: true
                }, {
                    name: await ctx.t("INV_JOIN"),
                    value: await ctx.t("INV_JOIN_LINK",inviteData.code),
                    inline: true
                }],
                footer: inviteData.inviter ? {
                    text: await ctx.t("INV_INVITER", this.sosamba.getTag(inviteData.inviter)),
                    icon_url: inviteData.avatarURL
                } : null
            }
        });
    }
}

module.exports = InviteInspectorCommand;