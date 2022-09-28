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
const errString = "Must be implemented by a member class";
class DBProvider {
    constructor(sosamba) {
        this.sosamba = sosamba;
    }

    // eslint-disable-next-line no-unused-vars
    getGuildConfig(guildID) {
        throw new Error(errString);
    }

    // eslint-disable-next-line no-unused-vars
    updateGuildConfig(guildID, data) {
        throw new Error(errString);
    }

    // eslint-disable-next-line no-unused-vars
    createGuildConfig(data) {
        throw new Error(errString);
    }

    // eslint-disable-next-line no-unused-vars
    getUserProfile(userID) {
        throw new Error(errString);
    }

    // eslint-disable-next-line no-unused-vars
    createUserProfile(data) {
        throw new Error(errString);
    }

    // eslint-disable-next-line no-unused-vars
    updateUserProfile(userID, data) {
        throw new Error(errString);
    }

    // eslint-disable-next-line no-unused-vars
    deleteUserProfile(userID) {
        throw new Error(errString);
    }

    // eslint-disable-next-line no-unused-vars
    getGuildModlog(guildID) {
        throw new Error(errString);
    }

    // eslint-disable-next-line no-unused-vars
    insertNewModlog(guildID) {
        throw new Error(errString);
    }

    // eslint-disable-next-line no-unused-vars
    updateModlog(guildID, data) {
        throw new Error(errString);
    }

    // eslint-disable-next-line no-unused-vars
    getTag(name) {
        throw new Error(errString);
    }

    // eslint-disable-next-line no-unused-vars
    deleteTag(name) {
        throw new Error(errString);
    }

    // eslint-disable-next-line no-unused-vars
    updateTag(name, data) {
        throw new Error(errString);
    }

    // eslint-disable-next-line no-unused-vars
    createTag(name, data) {
        throw new Error(errString);
    }

    // eslint-disable-next-line no-unused-vars
    getGuildExtensions(guildID, trigger) {
        throw new Error(errString);
    }

    // eslint-disable-next-line no-unused-vars
    getGuildPhoneNumbers(guildID) {
        throw new Error(errString);
    }

    // eslint-disable-next-line no-unused-vars
    getPhoneNumber(number) {
        throw new Error(errString);
    }

    // eslint-disable-next-line no-unused-vars
    createPhoneNumber(data) {
        throw new Error(errString);
    }

    // eslint-disable-next-line no-unused-vars
    getChannelPhoneNumbers(guildID, channelID) {
        throw new Error(errString);
    }

    // eslint-disable-next-line no-unused-vars
    getGuildExtensionStore(guildID, store) {
        throw new Error(errString);
    }

    // eslint-disable-next-line no-unused-vars
    createGuildExtensionStore(guildID, store, data = "{}") {
        throw new Error(errString);
    }

    // eslint-disable-next-line no-unused-vars
    createGuildExtension(data) {
        throw new Error(errString);
    }

    // eslint-disable-next-line no-unused-vars
    deleteGuildExtension(id) {
        throw new Error(errString);
    }

    // eslint-disable-next-line no-unused-vars
    deleteGuildExtensionStore(guildID, store) {
        throw new Error(errString);
    }

    // eslint-disable-next-line no-unused-vars
    updateGuildExtensionStore(guildID, store, data) {
        throw new Error(errString);
    }
    
    // eslint-disable-next-line no-unused-vars
    updateGuildExtension(id, data) {
        throw new Error(errString);
    }

    // eslint-disable-next-line no-unused-vars
    getGuildExtension(id) {
        throw new Error(errString);
    }


    // eslint-disable-next-line no-unused-vars
    getSession(sid) {
        throw new Error(errString);
    }

    // eslint-disable-next-line no-unused-vars
    setSession(sid, data) {
        throw new Error(errString);
    }

    // eslint-disable-next-line no-unused-vars
    removeSession(sid) {
        throw new Error(errString);
    }

    // eslint-disable-next-line no-unused-vars
    purgeSessions() {
        throw new Error(errString);
    }

    // eslint-disable-next-line no-unused-vars
    databaseSetup() {
        throw new Error(errString);
    }

    getBlacklistedGuilds() {
        throw new Error(errString);
    }

    // eslint-disable-next-line no-unused-vars
    getBlacklistedGuildById(id) {
        throw new Error(errString);
    }

    // eslint-disable-next-line no-unused-vars
    addBlacklistedGuild(id, owner, reason) {
        throw new Error(errString);
    }

    // eslint-disable-next-line no-unused-vars
    removeBlacklistedGuild(id) {
        throw new Error(errString);
    }
}

module.exports = DBProvider;
