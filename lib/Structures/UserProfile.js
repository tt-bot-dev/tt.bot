"use strict";

const {encrypt, decrypt} = require("../dataEncryption");
module.exports = class UserProfile {
    constructor(data) {
        this.id = data.id;
        this.fake = data.fake;
        this.timezone = data.timezone ? decrypt(data.timezone) : null;
        this.locale = data.locale ? decrypt(data.locale) : null;
    }
    toEncryptedObject() {
        return UserProfile.create(this);
    }
    static create(data) {
        return {
            id: data.id,
            timezone: data.timezone && encrypt(data.timezone),
            locale: data.timezone && encrypt(data.locale)
        };
    }
};