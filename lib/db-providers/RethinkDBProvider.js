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

"use strict";
const DBProvider = require("../DBProvider");
const rethinkdbdash = require("rethinkdbdash");


module.exports = sosamba => class RethinkDBProvider extends DBProvider {
    constructor(opts) {
        super(sosamba);
        this.db = rethinkdbdash(opts);
        this._dbLock = this.db.db(opts.db || this.db._db).wait().then(() => this.databaseSetup());
        delete global.r; // rethinkdbdash auto-pollutes the globals with r.X();
    }

    async getGuildConfig(guildID) {
        await this._dbLock;
        return await this.db.table("configs").get(guildID);
    }

    async updateGuildConfig(guildID, data) {
        await this._dbLock;
        return await this.db.table("configs").get(guildID).update(data);
    }

    async createGuildConfig(data) {
        await this._dbLock;
        return await this.db.table("configs").insert(data);
    }

    async getUserProfile(userID) {
        await this._dbLock;
        return await this.db.table("profile").get(userID);
    }

    async createUserProfile(data) {
        await this._dbLock;
        return await this.db.table("profile").insert(data);
    }

    async updateUserProfile(userID, data) {
        await this._dbLock;
        return await this.db.table("profile").get(userID).update(data);
    }

    async deleteUserProfile(userID) {
        await this._dbLock;
        return await this.db.table("profile").get(userID).delete();
    }

    async getGuildModlog(guildID) {
        await this._dbLock;
        return await this.db.table("modlog").get(guildID);
    }

    async insertNewModlog(guildID) {
        await this._dbLock;
        await this.db.table("modlog").insert({
            id: guildID,
            items: []
        });
        return await this.getGuildModlog(guildID);
    }

    async updateModlog(guildID, data) {
        await this._dbLock;
        await this.db.table("modlog").get(guildID).update(data);
    }

    async getTag(name) {
        await this._dbLock;
        return await this.db.table("tags").get(name);
    }

    async deleteTag(name) {
        await this._dbLock;
        await this.db.table("tags").get(name).delete();
    }

    async updateTag(name, data) {
        await this._dbLock;
        await this.db.table("tags").get(name)
            .update(data);
    }

    async createTag(data) {
        await this._dbLock;
        await this.db.table("tags").insert(data);
    }

    async getGuildExtensions(guildID, trigger) {
        await this._dbLock;
        return await this.db.table("extensions").filter({
            guildID,
            commandTrigger: trigger
        });
    }

    async getGuildPhoneNumbers(guildID) {
        await this._dbLock;
        return await this.db.table("phone").filter({
            guildID
        });
    }

    async deletePhoneNumber(number) {
        await this._dbLock;
        return await this.db.table("phone").get(number).delete();
    }

    async getPhoneNumber(number) {
        await this._dbLock;
        return await this.db.table("phone").get(number);
    }

    async createPhoneNumber(data) {
        await this._dbLock;
        return await this.db.table("phone").insert(data);
    }

    async getChannelPhoneNumbers(guildID, channelID) {
        await this._dbLock;
        return await this.db.table("phone").filter({
            guildID,
            channelID
        });
    }

    async getGuildExtensionStore(guildID, store) {
        await this._dbLock;
        return await this.db.table("extension_store")
            .get([guildID, store]);
    }

    async createGuildExtensionStore(guildID, store, data = "{}") {
        await this._dbLock;
        return await this.db.table("extension_store")
            .insert({
                id: [guildID, store],
                store: data
            }, {
                conflict: "error"
            });
    }

    async createGuildExtension(data) {
        await this._dbLock;
        return await this.db.table("extensions")
            .insert(data);
    }

    async deleteGuildExtension(id) {
        await this._dbLock;
        return await this.db.table("extensions")
            .get(id).delete();
    }

    async deleteGuildExtensionStore(guildID, store) {
        await this._dbLock;
        return await this.db.table("extension_store")
            .get([guildID, store])
            .delete();
    }
    async getGuildExtension(id) {
        await this._dbLock;
        return await this.db.table("extensions")
            .get(id);
    }

    async updateGuildExtensionStore(guildID, store, data = "{}") {
        await this._dbLock;
        return await this.db.table("extension_store")
            .get([guildID, store])
            .update({
                store: data
            });
    }

    async updateGuildExtension(id, data) {
        await this._dbLock;
        return await this.db.table("extensions")
            .get(id)
            .update(data);
    }

    async getSession(sid) {
        await this._dbLock;
        return await this.db.table("session")
            .get(sid);
    }

    async setSession(sid, data) {
        await this._dbLock;
        return await this.db.table("session")
            .insert({
                id: sid,
                ...data
            }, {
                conflict: "replace"
            });
    }

    async removeSession(sid) {
        await this._dbLock;
        return await this.db.table("session")
            .get(sid)
            .delete();
    }

    async purgeSessions() {
        await this._dbLock;
        return await this.db.table("session")
            .filter(this.db.row("expires").lt(Date.now()))
            .delete();
    }

    async getBlacklistedGuilds() {
        await this._dbLock;
        return await this.db.table("blacklist");
    }

    async getBlacklistedGuildById(id) {
        await this._dbLock;
        return await this.db.table("blacklist")
            .filter(this.db.row("id").eq(id).or(this.db.row("ownerID").eq(id)));
    }

    async addBlacklistedGuild(id, owner, reason) {
        await this._dbLock;
        return await this.db.table("blacklist").insert({
            id,
            ownerID: owner,
            reason
        });
    }

    async removeBlacklistedGuild(id) {
        await this._dbLock;
        return await this.db.table("blacklist")
            .filter(this.db.row("id").eq(id).or(this.db.row("ownerID").eq(id)))
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
