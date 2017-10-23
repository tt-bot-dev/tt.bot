module.exports = class StarboardObject {
    constructor(data) {
        this.id = data.id;
    }
    toEncryptedObject() {
        return StarboardObject.create(this);
    }
    static create(data) {
        return {
            id: data.id,
            channelID: data.channelID
        };
    }
};