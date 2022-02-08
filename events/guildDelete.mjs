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
import config from "../config.js";

class GuildLeaveEvent extends Event {
    constructor(...args) {
        super(...args, {
            name: "guildDelete"
        });
    }

    prerequisites(guild) {
        return !guild.__automaticallyLeft;
    }

    async run(guild) {
        await this.sosamba.createMessage(config.serverLogChannel, {
            embeds: [{
                author: {
                    name: `I was removed from ${guild.name} (${guild.id}) 😢`,
                    icon_url: guild.iconURL
                },
                color: 0x008800
            }]
        });
    }
}

export default GuildLeaveEvent;