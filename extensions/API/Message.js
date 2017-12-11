let origMsg = null;
const User = require("./User");
const Guild = require("./Guild")
const resolveId = require("./Utils/ResolveUserID");
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
        this.guild = new Guild(msg.guild);
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

    // noinspection JSMethodCanBeStatic
    delete(reason) {
        return origMsg.delete(reason).then(() => true).catch(() => false);
    }

    // noinspection JSMethodCanBeStatic
    pin() {
        return origMsg.pin().then(() => true).catch(() => false);
    }

    // noinspection JSMethodCanBeStatic
    unpin() {
        return origMsg.pin().then(() => true).catch(() => false);
    }

    // noinspection JSMethodCanBeStatic
    getReaction(reaction, limit, before, after) {
        if (before && after) return Promise.reject("Cannot specify both before and after");
        return origMsg.getReaction(reaction, limit, before, after).then(u => u.map(user => new User(user))).catch(() => false);
    }

    // noinspection JSMethodCanBeStatic
    addReaction(reaction) {
        return origMsg.addReaction(reaction).then(() => true).catch(() => false);
    }

    // noinspection JSMethodCanBeStatic
    removeReaction(reaction, user) {
        user = resolveId(user);
        return origMsg.removeReaction(reaction, user).then(() => true).catch(() => false);
    }

    // noinspection JSMethodCanBeStatic
    edit(content) {
        return origMsg.edit(content).then(m => new Message(m)).catch(() => false);
    }
}
module.exports = Message;