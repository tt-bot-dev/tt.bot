"use strict";
const { Event } = require("sosamba");
const logging = require("../lib/logging");

class GuildUnbanLogger extends Event {
    constructor(...args) {
        super(...args, {
            name: "guildBanRemove"
        });
    }

    async run(guild, user) {
        const logConfig = await logging.getInfo(guild.id, this.sosamba.db);
        if (logConfig.logEvents.includes("guildUnban")) {
            await logging.handlers.ban(logConfig, guild, user, true);
        }
    }
}

module.exports = GuildUnbanLogger;