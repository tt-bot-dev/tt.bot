"use strict";
const { encrypt, decrypt } = require("../dataEncryption");
module.exports = class FeedbackObject {
    constructor(data) {
        this.id = data.id;
        this.feedbackString = decrypt(data.feedbackString);
        this.guild = {};
        this.guild.id = data.guild.id;
        this.guild.ownerID = data.guild.ownerID;
        this.channel = {};
        this.channel.id = data.channel.id;
        this.submitter = {};
        this.submitter.username = decrypt(data.submitter.username);
        this.submitter.discriminator = decrypt(data.submitter.discriminator);
        this.submitter.id = data.submitter.id;
        this.respMsg = {};
        this.respMsg.id = data.respMsg.id;
    }
    static create(msg, args) {
        return {
            feedbackString: encrypt(args),
            submitter: {
                username: encrypt(msg.author.username),
                discriminator: encrypt(msg.author.discriminator),
                id: msg.author.id
            },
            guild: {
                id: msg.guild.id,
                ownerID: msg.guild.ownerID,
            },
            channel: {
                id: msg.channel.id
            }
        };
    }
};