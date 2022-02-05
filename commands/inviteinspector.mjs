/**
 * Copyright (C) 2022 tt.bot dev team
 * 
 * This file is part of tt.bot.
 * 
 * tt.bot is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * tt.bot is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with tt.bot.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Command } from "sosamba";

class InviteInspectorCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: "inviteinspector",
            //args: "<invite:String>",
            description: "Gets information about an invite.",
            aliases: ["iinspector"]
        });
    }

    async run(ctx, args) {
        return; // TODO: decide on the future of this command... it might be a candidate for removal
        // eslint-disable-next-line no-unreachable
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
                        description: await ctx.t("CANNOT_GET_INVITE_BANNED"),
                        footer: {
                            text: await ctx.t("CONTACT_GUILD_ADMIN")
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

export default InviteInspectorCommand;