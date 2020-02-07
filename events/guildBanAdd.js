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
        const logConfig = await logging.getInfo(guild.id, this.sosamba.db);
        if (logConfig.logEvents.includes("guildBan")) {
            await logging.handlers.ban(logConfig, guild, user, false);
        }
        const config = await this.sosamba.db.getGuildConfig(guild.id);
        if (config && config.modlogChannel && 
            guild.members.get(this.sosamba.user.id).permission.has("viewAuditLogs")) {
            let auditLog;
            try {
                auditLog = await guild.getAuditLogs(50, null, 22);
            } catch {}
            if (auditLog) {
                const entry = auditLog.entries.find(entry => entry.targetID === user.id);
                if (entry && entry.user.id !== this.sosamba.user.id) this.sosamba.modLog.addBan(user.id, {
                    guildConfig: config,
                    author: entry.user,
                    guild
                }, entry.reason);
            }
        }
    }
}

module.exports = GuildBanEvent;