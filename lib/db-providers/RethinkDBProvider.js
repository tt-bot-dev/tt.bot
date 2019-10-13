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

    async getGuildExtensions(guildID) {
        return await this.db.table("extensions").filter({
            guildID
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
};