"use strict";
const DBProvider = require("../DBProvider");
const rethinkdbdash = require("rethinkdbdash");


module.exports = sosamba => class RethinkDBProvider extends DBProvider {
    constructor(opts) {
        super(sosamba);
        this.db = rethinkdbdash(opts);
    }

    async getGuildConfig(guildID) {
        return await this.db.table("configs").get(guildID);
    }

    async updateGuildConfig(guildID, data) {
        return await this.db.table("configs").get(guildID).update(data);
    }

    async createGuildConfig(data) {
        return await this.db.table("configs").insert(data);
    }

    async getUserProfile(userID) {
        return await this.db.table("profile").get(userID);
    }

    async createUserProfile(data) {
        return await this.db.table("profile").insert(data);
    }

    async updateUserProfile(userID, data) {
        return await this.db.table("profile").get(userID).update(data);
    }

    async deleteUserProfile(userID) {
        return await this.db.table("profile").get(userID).delete();
    }

    async getGuildModlog(guildID) {
        return await this.db.table("modlog").get(guildID);
    }

    async insertNewModlog(guildID) {
        await this.db.table("modlog").insert({
            id: guildID,
            items: []
        });
        return await this.getGuildModlog(guildID);
    }

    async updateModlog(guildID, data) {
        await this.db.table("modlog").get(guildID).update(data);
    }

    async getTag(name) {
        return await this.db.table("tags").get(name);
    }

    async deleteTag(name) {
        await this.db.table("tags").get(name).delete();
    }

    async updateTag(name, data) {
        await this.db.table("tags").get(name)
            .update(data);
    }

    async createTag(data) {
        await this.db.table("tags").insert(data);
    }

    async getGuildExtensions(guildID, trigger) {
        return await this.db.table("extensions").filter({
            guildID,
            commandTrigger: trigger
        });
    }

    async getGuildPhoneNumbers(guildID) {
        return await this.db.table("phone").filter({
            guildID
        });
    }

    async deletePhoneNumber(number) {
        return await this.db.table("phone").get(number).delete();
    }

    async getPhoneNumber(number) {
        return await this.db.table("phone").get(number);
    }

    async createPhoneNumber(data) {
        return await this.db.table("phone").insert(data);
    }

    async getChannelPhoneNumbers(guildID, channelID) {
        return await this.db.table("phone").filter({
            guildID,
            channelID
        });
    }

    async getGuildExtensionStore(guildID, store) {
        return await this.db.table("extension_store")
            .get([guildID, store]);
    }

    async createGuildExtensionStore(guildID, store, data = "{}") {
        return await this.db.table("extension_store")
            .insert({
                id: [guildID, store],
                store: data
            }, {
                conflict: "error"
            });
    }

    async createGuildExtension(data) {
        return await this.db.table("extensions")
            .insert(data);
    }

    async deleteGuildExtension(id) {
        return await this.db.table("extensions")
            .get(id).delete();
    }

    async deleteGuildExtensionStore(guildID, store) {
        return await this.db.table("extension_store")
            .get([guildID, store])
            .delete();
    }
    async getGuildExtension(id) {
        return await this.db.table("extensions")
            .get(id);
    }

    async updateGuildExtensionStore(guildID, store, data = "{}") {
        return await this.db.table("extension_store")
            .get([guildID, store])
            .update({
                store: data
            });
    }

    async updateGuildExtension(id, data) {
        return await this.db.table("extensions")
            .get(id)
            .update(data);
    }

    async getSession(sid) {
        return await this.db.table("session")
            .get(sid);
    }

    async setSession(sid, data) {
        return await this.db.table("session")
            .insert({
                id: sid,
                ...data
            }, {
                conflict: "replace"
            });
    }

    async removeSession(sid) {
        return await this.db.table("session")
            .get(sid)
            .delete();
    }

    async purgeSessions() {
        return await this.db.table("session")
            .filter(this.db.row("expires").lt(Date.now()))
            .delete();
    }

    async databaseSetup() {
        const tables = ["blacklist",
            "session",
            "configs",
            "feedback",
            "tags",
            "profile",
            "modlog",
            "extensions",
            "extension_store",
            "phone"];
        
        const dbTables = await this.db.tableList();
        for (const table of tables) {
            if (!dbTables.includes(table)) await this.db.tableCreate(table);
        }
    }
};