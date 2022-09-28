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


import { Event } from "sosamba";
import * as logging from "../lib/logging.mjs";

class MessageUpdateLogger extends Event {
    constructor(...args) {
        super(...args, {
            name: "messageUpdate",
        });
    }

    async prerequisites(msg, old) {
        return old && msg.author && !msg.author.bot && msg.channel.guild
        && old.content !== msg.content;
    }

    async run(msg, old) {
        const logConfig = await logging.getInfo(msg.channel.guild.id, this.sosamba.db);
        if (logConfig.logEvents.includes("messageUpdate")) {
            await logging.handlers.update(logConfig, msg, old);
        }
    }
}

export default MessageUpdateLogger;
