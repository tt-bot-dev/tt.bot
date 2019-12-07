"use strict";
const { Event } = require("sosamba");
const logging = require("../lib/logging");

class MessageUpdateLogger extends Event {
    constructor(...args) {
        super(...args, {
            name: "messageUpdate"
        });
    }

    async prerequisites(msg, old) {
        return old && msg.author && !msg.author.bot && msg.channel.guild
        && old.content !== msg.content;
    }

    async run(msg, old) {
        const logConfig = await logging.getInfo(msg.channel.guild.id, this.sosamba.db);
        if (logConfig.logEvents.includes("messageUpdate")) {
            await logging.handlers.update(config, msg, old);
        }
    }
}

module.exports = MessageUpdateLogger;