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

export default async function (config, guild, user, unban) {
    let auditLog;
    if (guild.members.get(guild.shard.client.user.id)
        .permission.has("viewAuditLogs")) {
        try {
            auditLog = await guild.getAuditLogs(50, null, unban ? 23 : 22);
        } catch {}
    }
    const fields = [];
    if (auditLog) {
        const entry = auditLog.entries.find(entry => entry.targetID === user.id);
        if (entry) {
            fields.push({
                name: `${unban? "Unb" : "B"}anned by`,
                value: `${entry.user.username}#${entry.user.discriminator} (${entry.user.id})`
            });
            if (!unban) fields.push({
                name: "Reason",
                value: entry.reason || "None"
            });
        }
    }
    if (!guild.channels.has(config.logChannel)) return;
    try {
        await guild.channels.get(config.logChannel).createMessage({
            embeds: [{
                author: {
                    name: `${user.username}#${user.discriminator} (${user.id})`,
                    icon_url: user.avatarURL
                },
                title: `has got ${unban ? "un" : ""}banned`,
                fields,
                color: unban? 0x008800 : 0xFF0000
            }]
        });
    } catch {}
}