let origMsg = null
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
        // this.roleMentions msg.roleMentions.map(r => this.guild.roles.get(r));
        this.timestamp = msg.timestamp;
        this.tts = msg.tts;
        this.type = msg.type;
    }
}
module.exports = Message;