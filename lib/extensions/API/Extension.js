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
module.exports = db => class Extension {
    /**
     * Extension storage constructor
     * @param {string} id The ID of the extension
     * @param {string} name The name of the extension
     * @param {object} data The stored data we already have
     * @param {number} flags Extension flags (permissions)
     */
    constructor(id, name, data, flags) {
        Object.defineProperty(this, "id", {
            get: () => id,
            set: (_) => id, // eslint-disable-line no-unused-vars
            configurable: true
        });
        Object.defineProperty(this, "name", {
            get: () => name,
            set: (_) => name, // eslint-disable-line no-unused-vars
            configurable: true
        });
        this.store = data;
        Object.defineProperty(this, "flags", {
            get: () => flags,
            set: (_) => flags, // eslint-disable-line no-unused-vars
            configurable: true
        });
    }

    /**
     * Updates the data in the database.
     * @param {object} data The new stored data
     * @returns {Promise<object>}
     */
    async updateData(data) {
        if (!this.store) throw new Error("You haven't set up a storage");
        if ((typeof data === "string" ? data : JSON.stringify(data)).length > 25 * 1024 ** 2) { // 25 MiB
            throw new Error("The extension exceeded the storage limit of 25 MiB");
        }
        
        let toSet;
        try {
            if (typeof data === "string") toSet = JSON.parse(data);
            else toSet = data;
        } catch(_) {
            throw new Error("The data must be JSON");
        }

        await db.updateGuildExtensionStore(this.store.guildID, this.store.id, JSON.stringify(toSet));
        return this.store = toSet;
    }

    /**
     * Irreversibly wipes the storage of the extension
     * @returns {Promise<object>}
     */
    async wipeData() {
        if (!this.store) throw new Error("You haven't set up a storage");
        await db.updateGuildExtensionStore(this.store.guildID, this.store.id);
        return this.store = {};
    }
};