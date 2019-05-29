"use strict";
const { encrypt, decrypt } = require("../dataEncryption");
module.exports = class TagObject {
    constructor(data) {
        this.id = decrypt(data.id);
        this.content = decrypt(data.content);
        this.owner = data.owner;
    }
    toEncryptedObject() {
        return TagObject.create(this);
    }
    static create(data) {
        return {
            id: encrypt(data.id),
            content: encrypt(data.content),
            owner: data.owner
        };
    }
};