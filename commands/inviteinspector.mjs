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

import { Command, Eris } from "sosamba";
import { t } from "../lib/util.mjs";
import resolveInvite from "../lib/util/resolveInvite.mjs";

const { Constants: { ApplicationCommandOptionTypes, ChannelTypes } } = Eris;

class InviteInspectorCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: "inviteinspector",
            // args: "<invite:String>",
            args: [
                {
                    name: "code",
                    description: "The code/invite link to look up",
                    type: ApplicationCommandOptionTypes.STRING,
                    required: true,
                },
            ],
            description: "Gets information about an invite.",
            aliases: ["iinspector"],
        });
    }

    async run(ctx, { code }) {
        // eslint-disable-next-line no-unreachable
        let inviteData;
        try {
            inviteData = await this.sosamba.getInvite(resolveInvite(code), true);
        } catch (err) {
            if (err.code === 40007) {
                return ctx.send({
                    embeds: [{
                        color: 0xFF0000,
                        author: {
                            name: await t(ctx,"OOPS"),
                        },
                        description: await t(ctx,"CANNOT_GET_INVITE_BANNED"),
                        footer: {
                            text: await t(ctx,"CONTACT_GUILD_ADMIN"),
                        },
                    }],
                });
            }
            return ctx.send({
                embeds: [{
                    color: 0xFF0000,
                    author: {
                        name: await t(ctx,"OOPS"),
                    },
                    description: await t(ctx,"CANNOT_GET_INVITE"),
                    footer: {
                        text: await t(ctx,"INVITE_ERR_FOOTER"),   
                    },
                }],
            });
        }

        const fields = [{
            name: await t(ctx, "INV_CHANNEL_TYPE"),
            value: `${this._getUserFriendlyChannelType(inviteData.channel.type)} ${inviteData.channel.name}`,
            inline: true,
        }, {
            name: await t(ctx, "MEMBERS"),
            value: `<:e:658538493470965787> ${inviteData.memberCount} | <:e:313956277808005120> ${inviteData.presenceCount}`,
            inline: true,
        }];

        /* if (inviteData.guildScheduledEvent) {} */ // todo - once eris implements support for scheduled events

        await ctx.send({
            embeds: [{
                color: 0x008800,
                title: `${inviteData.guild.name} (${inviteData.guild.id})`,
                url: `https://discord.gg/${inviteData.code}`,
                thumbnail: {
                    url: inviteData.guild.icon ?
                        inviteData.guild.iconURL :
                        "https://cdn.discordapp.com/embed/avatars/0.png",
                },
                fields,
                footer: inviteData.inviter ? {
                    text: await t(ctx, "INV_INVITER", {
                        user: this.sosamba.getTag(inviteData.inviter),
                    }),
                    icon_url: inviteData.inviter.avatarURL,
                } : null,
            }],
        });
    }

    /**
     * @param {import("eris").InviteChannel["type"]} type 
     */
    _getUserFriendlyChannelType(type) {
        switch (type) {
        case ChannelTypes.GUILD_TEXT: {
            return "<:e:585783907841212418>";
        }

        case ChannelTypes.GUILD_VOICE: {
            return "<:e:585783907673440266>";
        }

        case ChannelTypes.GUILD_NEWS: {
            return "<:e:658522693058166804>";
        }

        case ChannelTypes.GUILD_STORE: {
            return "<:e:658538492409806849>";
        }

        case ChannelTypes.GUILD_STAGE_VOICE: {
            return "<:e:824240882793447444>";
        }
        }
    }
}

export default InviteInspectorCommand;
