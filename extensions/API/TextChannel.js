const {Collection} = require("eris");
const Channel = require("./Channel");
const Message = require("./Message");
const Invite = require("./Invite");
const User = require("./User");
const resolveMsg = require("../Utils/ResolveMessageID");
const resolveUser = require("../Utils/ResolveUserID");
const r = require("../Utils/InterceptReason");

class TextChannel extends Channel {
    constructor(channel) {
        super(channel);
        this.lastMessage = new Message(channel.messages.get(channel.lastMessageID));
        this.lastPinTimestamp = channel.lastPinTimestamp;

        Object.defineProperty(this, "messages", {
            get: function () {
                const coll = new Collection(Message);
                channel.messages.forEach(m => coll.add(m));
                return coll;
            },
            configurable: true
        })

        this.topic = channel.topic;

        Object.defineProperty(this, "addMessageReaction", {
            value: function (message, reaction) {
                message = resolveMsg(message);
                return channel.addMessageReaction(message, reaction).then(() => true).catch(() => false);
            },
            configurable: true
        })

        Object.defineProperty(this, "createInvite", {
            value: function (options, reason) {
                return channel.createInvite(options, r(reason)).then(i => new Invite(i)).catch(() => false);
            },
            configurable: true
        })

        Object.defineProperty(this, "createMessage", {
            value: function (content, file) {
                return channel.createMessage(content, file).then(m => new Message(m)).catch(() => false);
            },
            configurable: true
        })

        Object.defineProperty(this, "createWebhook", {
            value: function (options, reason) {
                return channel.createWebhook(options, r(reason)).then(o => o).catch(() => false);
            },
            configurable: true
        })

        Object.defineProperty(this, "deleteMessage", {
            value: function (message, reason) {
                message = resolveMsg(message);
                return channel.deleteMessage(message, r(reason)).then(() => true).catch(() => false);
            },
            configurable: true
        })

        Object.defineProperty(this, "deleteMessages", {
            value: function (messages) {
                messages = messages.map(m => resolveMsg(m));
                return channel.deleteMessages(messages).then(() => true).catch(() => false);
            },
            configurable: true
        })

        Object.defineProperty(this, "editMessage", {
            value: function (message, content) {
                message = resolveMsg(message);
                return channel.editMessage(message, content).then(m => new Message(m)).catch(() => false);
            },
            configurable: true
        })

        Object.defineProperty(this, "getInvites", {
            value: function () {
                return channel.getInvites().then(i => i.map(inv => new Invite(inv))).catch(() => false);
            },
            configurable: true
        })

        Object.defineProperty(this, "getMessage", {
            value: function (id) {
                return channel.getMessage(id).then(m => new Message(m)).catch(() => false);
            },
            configurable: true
        })

        Object.defineProperty(this, "getMessageReaction", {
            value: function (id, reaction, limit, before, after) {
                id = resolveMsg(id);
                return channel.getMessageReaction(id, reaction, limit, before, after).then(u => u.map(u => new User(u))).catch(() => false);
            },
            configurable: true
        })

        Object.defineProperty(this, "getMessages", {
            value: function (limit, before, after, around) {
                return channel.getMessages(limit, before, after, around).then(m => m.map(m => new Message(m))).catch(() => false);
            },
            configurable: true
        })

        Object.defineProperty(this, "getPins", {
            value: function () {
                return channel.getPins().then(m => m.map(m => new Message(m))).catch(() => false);
            },
            configurable: true
        })

        Object.defineProperty(this, "getWebhooks", {
            value: function () {
                return channel.getWebhooks().then(w => w).catch(() => false);
            },
            configurable: true
        })

        Object.defineProperty(this, "purge", {
            value: function (limit, filter, before, after) {
                return channel.purge(limit, m => filter(new Message(m)), before, after).then(n => n).catch(() => false);
            },
            configurable: true
        })

        Object.defineProperty(this, "pinMessage", {
            value: function (message) {
                message = resolveMsg(message);
                return channel.pinMessage(message).then(() => true).catch(() => false);
            },
            configurable: true
        })

        Object.defineProperty(this, "removeMessageReaction", {
            value: function (message, reaction, user) {
                message = resolveMsg(message);
                user = resolveUser(user);
                return channel.removeMessageReaction(message, reaction, user).then(() => true).catch(() => false);
            },
            configurable: true
        })

        Object.defineProperty(this, "removeMessageReactions", {
            value: function (message) {
                message = resolveMsg(message);
                return channel.removeMessageReactions(message).then(() => true).catch(() => false);
            },
            configurable: true
        })

        Object.defineProperty(this, "sendTyping", {
            value: function () {
                return channel.sendTyping().then(() => true).catch(() => false);
            },
            configurable: true
        })

        Object.defineProperty(this, "unpinMessage", {
            value: function (message) {
                message = resolveMsg(message);
                return channel.unpinMessage(message).then(() => true).catch(() => false);
            },
            configurable: true
        })
    }
}

module.exports = TextChannel;