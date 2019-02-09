class Extension {
    /**
     * Extension storage constructor
     * @param {string} id The ID of the extension
     * @param {string} name The name of the extension
     * @param {object} data The stored data we already have
     */
    constructor(id, name, data) {
        this.id = id;
        this.name = name;
        this.store = data;
    }

    /**
     * Updates the data in the database.
     * @param {object} data The new stored data
     * @returns {Promise<object>}
     */
    async updateData(data) {
        if (!this.store) throw new Error("You haven't set up a storage")
        if ((typeof data === "string" ? data : JSON.stringify(data)).length > 25 * (1024 ** 2)) { // 25 MiB
            throw new Error("The extension exceeded the storage limit of 25 MiB");
        }
        
        let toSet;
        try {
            if (typeof data === "string") toSet = JSON.parse(data);
            else toSet = data;
        } catch(_) {
            throw new Error("The data must be JSON");
        }

        await db.table("extension_store").get([this.store.guildID, this.store.id]).update({ store: JSON.stringify(toSet) });
        return this.store = toSet;
    }

    /**
     * Irreversibly wipes the storage of the extension
     * @returns {Promise<object>}
     */
    async wipeData() {
        if (!this.store) throw new Error("You haven't set up a storage")
        await db.table("extension_store").get([this.store.guildID, this.store.id]).update({ store: JSON.stringify({}) })
        return this.store = {};
    }
}

module.exports = Extension;