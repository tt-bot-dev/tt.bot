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
    getUserProfile(userID) {
        throw new Error(errString);
    }
    // eslint-disable-next-line no-unused-vars
    updateUserProfile(userID, data) {
        throw new Error(errString);
    }
    // eslint-disable-next-line no-unused-vars
    getGuildModlog(guildID) {
        throw new Error(errString);
    }
}

module.exports = DBProvider;