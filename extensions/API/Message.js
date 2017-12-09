let origMsg = null;
const User = require("./User");
class Message {
    constructor(msg) {
        origMsg = msg;
        this.attachments = msg.attachments;
        this.author = new User(msg.author);
        // this.channel = msg.channel;
        // this.channelMentions = msg.channelMentions.map(c => this.guild.channels.get(c));
        this.cleanContent = msg.cleanContent;
        this.content = msg.content;
        this.editedTimestamp = msg.editedTimestamp;
        this.embeds = msg.embeds;
        this.id = msg.id;
        // this.member = msg.member;
        this.mentionEveryone = msg.mentionEveryone;
        this.mentions = msg.mentions.map(u => new User(u));
        // this.mentionsMembers = msg.mentions.map(u => this.guild.members.get(u))
        this.pinned = msg.pinned;
        this.reactions = msg.reactions;
        // this.roleMentions = msg.roleMentions.map(r => this.guild.roles.get(r));
        this.timestamp = msg.timestamp;
        this.tts = msg.tts;
        this.type = msg.type;
    }

    delete(reason) {
        return origMsg.delete(reason).then(() => true).catch(() => false);
    }

    pin() {
        return origMsg.pin().then(() => true).catch(() => false);
    }

    unpin() {
        return origMsg.pin().then(() => true).catch(() => false);
    }

    getReaction(reaction, limit, before, after) {
        if (before && after) return Promise.reject("Cannot specify both before and after");
        return origMsg.getReaction(reaction, limit, before, after).then(u => u.map(user => new User(user))).catch(() => false);
    }
}
module.exports = Message;