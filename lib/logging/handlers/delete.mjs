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

export default async function (config, msg) {
    if (!msg.channel.guild.channels.has(config.logChannel)) return;
    try {
        await msg.channel.guild.channels.get(config.logChannel).createMessage({
            embeds: [{
                author: {
                    name: `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`,
                    icon_url: msg.author.avatarURL,
                },
                title: "Message deleted",
                fields: [{
                    name: "ID",
                    value: msg.id,
                    inline: true,
                },
                {
                    name: "Channel",
                    value: msg.channel.mention,
                    inline: true,
                },

                {
                    name: "Old content",
                    value: msg.content.replace(/\[/g, "\\[").replace(/\]/g, "\\]")
                        .replace(/\(/g, "\\(")
                        .replace(/\)/g, "\\)"),
                },
                ],
                color: 0xFF0000,
            }],
        });
    } catch {}
}
