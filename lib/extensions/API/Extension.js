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