"use strict";

const {encrypt, decrypt} = require("../dataEncryption");
module.exports = class UserProfile {
    constructor(data) {
        this.id = data.id;
        this.color = decrypt(data.color);
        this.profileFields = (data.profileFields && data.profileFields.length > 0) ? data.profileFields.map(profileField => {
            return {
                inline: true,
                name: decrypt(profileField.name),
                value: decrypt(profileField.value)
            };
        }) : [];
        this.timezone = data.timezone ? decrypt(data.timezone) : null;
        this.locale = data.locale ? decrypt(data.locale) : null;
    }
    toEncryptedObject() {
        return UserProfile.create(this);
    }
    static create(data) {
        return {
            id: data.id, 
            color: encrypt(data.color),
            profileFields: data.profileFields.map(profileField => {
                return {
                    inline: true,
                    name: encrypt(profileField.name),
                    value: encrypt(profileField.value)
                };
            }) || [],
            timezone: encrypt(data.timezone),
            locale: encrypt(data.locale)
        };
    }
};