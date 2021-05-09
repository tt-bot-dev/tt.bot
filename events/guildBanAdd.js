/**
 * Copyright (C) 2021 tt.bot dev team
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

"use strict";
const { Event } = require("sosamba");
const logging = require("../lib/logging");

class GuildBanEvent extends Event {
    constructor(...args) {
        super(...args, {
            name: "guildBanAdd"
        });
    }

    async run(guild, user) {
        const [logConfig, config] = await Promise.all([
            logging.getInfo(guild.id, this.sosamba.db),
            this.sosamba.db.getGuildConfig(guild.id)
        ]);
        
        if (logConfig.logEvents.includes("guildBan")) {
            await logging.handlers.ban(logConfig, guild, user, false);
        }
        if (config?.modlogChannel && 
            guild.members.get(this.sosamba.user.id).permissions.has("viewAuditLogs")) {
            let auditLog;
            try {
                auditLog = await guild.getAuditLogs(50, null, 22);
            } catch {}
            if (auditLog) {
                const entry = auditLog.entries.find(entry => entry.targetID === user.id);
                if (entry?.user.id !== this.sosamba.user.id) this.sosamba.modLog.addBan(user.id, {
                    guildConfig: config,
                    author: entry.user,
                    guild
                }, entry.reason);
            }
        }
    }
}

module.exports = GuildBanEvent;
