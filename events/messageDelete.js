/**
 * Copyright (C) 2020 tt.bot dev team
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