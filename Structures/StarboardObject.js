const StarboardMessageObject = require("./StarboardMessageObject")
module.exports = class StarboardObject {
    constructor(data) {
        this.id = data.id;
        data.channelID
    }
    toEncryptedObject() {
        return StarboardObject.create(this);
    }
    static create(data) {
        let messages = {}
        for (let message of data.messages) {
            
        }
        return {
            id: data.id,
            channelID: data.channelID,
            messages: data.messages
        };
    }
};