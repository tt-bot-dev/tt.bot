"use strict";
module.exports = class FeedbackObject {
    constructor(data) {
        this.id = data.id;
        this.feedbackString = decryptData(data.feedbackString);
        this.guild = {};
        this.guild.id = data.guild.id;
        this.guild.ownerID = data.guild.ownerID;
        this.channel = {};
        this.channel.id = data.channel.id;
        this.submitter = {};
        this.submitter.username = decryptData(data.submitter.username);
        this.submitter.discriminator = decryptData(data.submitter.discriminator);
        this.submitter.id = data.submitter.id;
        this.respMsg = {};
        this.respMsg.id = data.respMsg.id;
    }
    static create(msg, args) {
        return {
            feedbackString: encryptData(args),
            submitter: {
                username: encryptData(msg.author.username),
                discriminator: encryptData(msg.author.discriminator),
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