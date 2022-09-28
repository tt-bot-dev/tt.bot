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
import { Eris } from "sosamba";
const { Base, Guild } = Eris;

function set() { }
/**
 * Overrides createdAt to provide more accurate timestamps
 */
Object.defineProperty(Base.prototype, "createdAt", {
    get: function () {
        return Number((BigInt(this.id) >> BigInt(22)) + BigInt(1420070400000));
    },
    set,
});
/**
 * Uses the top visible channel as the default channel
 */
Object.defineProperty(Guild.prototype, "defaultChannel", {
    get: function () {
        if (this.channels.filter((c) => c.type === 0).length === 0) return null;
        const defaultChannel = this.channels.filter((c) => c.type === 0 && 
        this.shard.client.hasBotPermission(c, "readMessages"))
            .sort((a, b) => a.position - b.position)[0];
        if (!defaultChannel) return null;
        return this.channels.get(defaultChannel.id);
    },
    set,
});
