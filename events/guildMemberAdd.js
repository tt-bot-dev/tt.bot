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

class GuildMemberJoinEvent extends Event {
    constructor(...args) {
        super(...args, {
            name: "guildMemberAdd"
        });
    }

    async run(guild, member) {
        const config = await this.sosamba.db.getGuildConfig(guild.id);
        if (config && config.greetingChannelId && config.greetingMessage) {
            const channel = guild.channels.get(config.greetingChannelId);
            if (channel) {
                try { 
                    await channel.createMessage(
                        this.sosamba.parseMsg(config.greetingMessage, member, guild));
                } catch {}
            } else {
                await this.sosamba.db.updateGuildConfig({
                    greetingChannelId: null
                });
            }
        }
    }
}

module.exports = GuildMemberJoinEvent;