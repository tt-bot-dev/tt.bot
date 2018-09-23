const Guild = require("./Guild");
const resolveId = require("../Utils/ResolveUserID");
const InterceptReason = require("../Utils/InterceptReason");
const Base = require("./Base");
let TextChannel, Member, User;
process.nextTick(() => {
    TextChannel= require("./TextChannel");
    Member = require("./Member");
    User = require("./User")
})
class Message extends Base {
    constructor(extension, msg) {
        super(extension, msg);
        this.attachments = msg.attachments;
        this.author = new User(extension, msg.author);
        Object.defineProperty(this, "channel", {
            get: function () {
                return new TextChannel(extension, msg.channel);
            },
            configurable: true
        })
        this.channelMentions = msg.channelMentions.map(c => this.guild.channels.get(c));
        this.cleanContent = msg.cleanContent;
        this.content = msg.content;
        this.editedTimestamp = msg.editedTimestamp;
        this.embeds = msg.embeds;
        this.guild = new Guild(extension, msg.guild);
        this.member = new Member(extension, msg.member);
        this.mentionEveryone = msg.mentionEveryone;
        this.mentions = msg.mentions.map(u => new User(extension, u));
        this.mentionsMembers = msg.mentions.map(u => this.guild.members.get(u));
        this.pinned = msg.pinned;
        this.reactions = msg.reactions;
        this.roleMentions = msg.roleMentions.map(r => this.guild.roles.get(r));
        this.timestamp = msg.timestamp;
        this.tts = msg.tts;
        this.type = msg.type;

        Object.defineProperty(this, "delete", {
            value: function (reason) {
                return msg.delete(InterceptReason(extension, reason)).then(() => true).catch(() => false);
            },
            configurable: true
        })

        Object.defineProperty(this, "pin", {
            value: function() {
                msg.pin().then(() => true).catch(() => false);
            },
            configurable: true
        })
        
        Object.defineProperty(this, "unpin", {
            value: function() {
                msg.unpin().then(() => true).catch(() => false);
            },
            configurable: true
        })

        Object.defineProperty(this, "getReaction", {
            value: function (reaction, limit, before, after) {
                if (before && after) return Promise.reject(false);
                return msg.getReaction(reaction, limit, before, after).then(u => u.map(user => new User(extension, user))).catch(() => false);
            },
            configurable: true
        })

        Object.defineProperty(this, "addReaction", {
            value: function (reaction) {
                return msg.addReaction(reaction).then(() => true).catch(() => false)
            },
            configurable: true
        })

        Object.defineProperty(this, "removeReaction", {
            value: function (reaction, user) {
                user = resolveId(user);
                return msg.removeReaction(reaction, user).then(() => true).catch(() => false);
            },
            configurable: true
        })

        Object.defineProperty(this, "removeReactions", {
            value: function () {
                return msg.removeReactions().then(() => true).catch(() => false);
            },
            configurable: true
        })

        Object.defineProperty(this, "edit", {
            value: function (content) {
                return msg.edit(content).then(m => new Message(extension, m)).catch(() => false);
            },
            configurable: true
        })

        Object.defineProperty(this, "reply", {
            value: function (...args) {
                return msg.channel.createMessage(...args).then(m => new Message(extension, m)).catch(() => false);
            },
            configurable: true
        })
    }
}
module.exports = Message;