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