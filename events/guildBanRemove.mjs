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

export default GuildUnbanLogger;