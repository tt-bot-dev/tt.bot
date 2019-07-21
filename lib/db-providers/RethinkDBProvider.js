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

    async getUserProfile(userID) {
        return await this.db.table("profile").get(userID);
    }

    async updateUserProfile(userID, data) {
        return await this.db.table("configs").get(userID).update(data);
    }

    async getGuildModlog(guildID) {
        return await this.db.table("modlog").get(guildID);
    }

    async deleteTag(guildID) {
        await this.db.table("modlog").insert({
            id: guildID,
            items: []
        });
        return await this.getGuildModlog(guildID);
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

    async getGuildExtensions(guildID) {
        return await this.db.table("extensions").filter({
            guildID
        });
    }
};