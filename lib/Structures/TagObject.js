module.exports = class TagObject {
    constructor(data) {
        this.id = decryptData(data.id);
        this.content = decryptData(data.content);
        this.owner = data.owner;
    }
    toEncryptedObject() {
        return TagObject.create(this);
    }
    static create(data) {
        return {
            id: encryptData(data.id),
            content: encryptData(data.content),
            owner: data.owner
        };
    }
};