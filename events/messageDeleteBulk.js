"use strict";
const { Event } = require("sosamba");
const logging = require("../lib/logging");

class BulkDeleteLogger extends Event {
    constructor(...args) {
        super(...args, {
            name: "messageDeleteBulk"
        });
    }

    async prerequisites(msg) {
        return msg[0].channel.guild;
    }

    async run(msg) {
        const [{ channel }] = msg;
        const logConfig = await logging.getInfo(channel.guild.id, this.sosamba.db);
        if (logConfig.logEvents.includes("messageBulkDelete")) {
            await logging.handlers.bulkDelete(logConfig, msg.length, channel);
        }
    }
}

module.exports = BulkDeleteLogger;