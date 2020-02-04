"use strict";
const { Event } = require("sosamba");
const logging = require("../lib/logging");

class MessageDeleteLogger extends Event {
    constructor(...args) {
        super(...args, {
            name: "messageDelete"
        });
    }

    async prerequisites(msg) {
        return !!msg.channel.guild;
    }

    async run(msg) {
        const logConfig = await logging.getInfo(msg.channel.guild.id, this.sosamba.db);
        if (!msg.author) {
            if (logConfig.logEvents.includes("messageUnknownDelete")) await logging.handlers.unknownDelete(logConfig, msg);
        } else if (logConfig.logEvents.includes("messageDelete") && !msg.author.bot) {
            await logging.handlers.delete(logConfig, msg);
        }
    }
}

module.exports = MessageDeleteLogger;