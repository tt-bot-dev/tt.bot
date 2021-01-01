/**
 * Copyright (C) 2021 tt.bot dev team
 * 
 * This file is part of tt.bot.
 * 
 * tt.bot is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * tt.bot is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with tt.bot.  If not, see <http://www.gnu.org/licenses/>.
 */

"use strict";
const { Collection } = require("eris");
const Channel = require("./Channel");
const Message = require("./Message");
const Invite = require("./Invite");
const User = require("./User");
const resolveMsg = require("../Utils/ResolveMessageID");
const resolveUser = require("../Utils/ResolveUserID");
const r = require("../Utils/InterceptReason");
const checkPermission = require("../Utils/CheckPrivilege");

class TextChannel extends Channel {
    constructor(extension, channel) {
        super(extension, channel);
        Object.defineProperty(this, "lastMessage", {
            get: function () {
                return new Message(extension, channel.messages.get(channel.lastMessageID));
            }
        });
        this.lastPinTimestamp = channel.lastPinTimestamp;

        Object.defineProperty(this, "messages", {
            get: function () {
                const coll = new Collection(Message);
                channel.messages.forEach(m => coll.add(new Message(extension, m)));
                return coll;
            },
            configurable: true
        });

        this.topic = channel.topic;

        Object.defineProperty(this, "addMessageReaction", {
            value: function (message, reaction) {
                if (!channel.guild.shard.client.hasBotPermission(channel, "addReactions")) {
                    return Promise.resolve(false);
                }
                message = resolveMsg(message);
                return channel.addMessageReaction(message, reaction).then(() => true).catch(() => false);
            },
            configurable: true
        });

        Object.defineProperty(this, "createInvite", {
            value: function (options, reason) {
                try {
                    checkPermission(extension, "guildSettings");
                } catch (e) {
                    return Promise.reject(e);
                }
                if (!channel.guild.shard.client.hasBotPermission(channel, "createInstantInvite")) {
                    return Promise.resolve(false);
                }
                return channel.createInvite(options, r(extension, reason)).then(i => new Invite(i)).catch(() => false);
            },
            configurable: true
        });

        Object.defineProperty(this, "createMessage", {
            value: function (content, file) {
                if (!channel.guild.shard.client.hasBotPermission(channel, "sendMessages")) {
                    return Promise.resolve(false);
                }
                const _content = Object.assign({}, content);
                if (content.allowedMentions &&
                    !checkPermission(extension, "mentionEveryone", false)) {
                    _content.allowedMentions = {
                        everyone: false,
                        roles: false,
                        users: false
                    };
                }
                return channel.createMessage(_content, file)
                    .then(m => new Message(extension, m)).catch(() => false);
            },
            configurable: true
        });

        Object.defineProperty(this, "createWebhook", {
            value: function (options, reason) {
                if (!channel.guild.shard.client.hasBotPermission(channel, "manageWebhooks")) {
                    return Promise.resolve(false);
                }
                return channel.createWebhook(options, r(extension, reason)).then(o => o).catch(() => false);
            },
            configurable: true
        });

        Object.defineProperty(this, "deleteMessage", {
            value: function (message, reason) {
                if (!channel.guild.shard.client.hasBotPermission(channel, "manageMessages")) {
                    return Promise.resolve(false);
                }
                message = resolveMsg(message);
                return channel.deleteMessage(message, r(extension, reason)).then(() => true).catch(() => false);
            },
            configurable: true
        });

        Object.defineProperty(this, "deleteMessages", {
            value: function (messages) {
                if (!channel.guild.shard.client.hasBotPermission(channel, "manageMessages")) {
                    return Promise.resolve(false);
                }
                messages = messages.map(m => resolveMsg(m));
                return channel.deleteMessages(messages).then(() => true).catch(() => false);
            },
            configurable: true
        });

        Object.defineProperty(this, "editMessage", {
            value: function (message, content) {
                message = resolveMsg(message);
                if (channel.messages.has(message)
                    && channel.messages.get(message).author.id !== channel.guild.shard.client.user.id) {
                    return Promise.resolve(false);
                }
                return channel.editMessage(message, content).then(m => new Message(extension, m)).catch(() => false);
            },
            configurable: true
        });

        Object.defineProperty(this, "getInvites", {
            value: function () {
                const me = channel.guild.members.get(channel.guild.shard.client.user.id);
                if (!me.permission.has("manageGuild")) {
                    return Promise.resolve(false);
                }
                return channel.getInvites().then(i => i.map(inv => new Invite(extension, inv))).catch(() => false);
            },
            configurable: true
        });

        Object.defineProperty(this, "getMessage", {
            value: function (id) {
                if (!channel.guild.shard.client.hasBotPermission(channel, "readMessageHistory")) {
                    return Promise.resolve(false);
                }
                return channel.getMessage(id).then(m => new Message(extension, m)).catch(() => false);
            },
            configurable: true
        });

        Object.defineProperty(this, "getMessageReaction", {
            value: function (id, reaction, limit, before, after) {
                if (!channel.guild.shard.client.hasBotPermission(channel, "readMessageHistory")) {
                    return Promise.resolve(false);
                }
                id = resolveMsg(id);
                return channel.getMessageReaction(id, reaction, limit, before, after).then(u => u.map(u => new User(extension, u))).catch(() => false);
            },
            configurable: true
        });

        Object.defineProperty(this, "getMessages", {
            value: function (limit, before, after, around) {
                if (!channel.guild.shard.client.hasBotPermission(channel, "readMessageHistory")) {
                    return Promise.resolve(false);
                }
                return channel.getMessages(limit, before, after, around).then(m => m.map(m => new Message(extension, m))).catch(() => false);
            },
            configurable: true
        });

        Object.defineProperty(this, "getPins", {
            value: function () {
                if (!channel.guild.shard.client.hasBotPermission(channel, "readMessageHistory")) {
                    return Promise.resolve(false);
                }
                return channel.getPins().then(m => m.map(m => new Message(extension, m))).catch(() => false);
            },
            configurable: true
        });

        Object.defineProperty(this, "getWebhooks", {
            value: function () {
                if (!channel.guild.shard.client.hasBotPermission(channel, "manageWebhooks")) {
                    return Promise.resolve(false);
                }
                return channel.getWebhooks().then(w => w).catch(() => false);
            },
            configurable: true
        });

        Object.defineProperty(this, "purge", {
            value: function (limit, filter, before, after) {
                if (!channel.guild.shard.client.hasBotPermission(channel, "manageMessages") ||
                    !channel.guild.shard.client.hasBotPermission(channel, "readMessageHistory")) {
                    return Promise.resolve(false);
                }
                if (!filter) filter = () => true;
                return channel.purge(limit, m => filter(new Message(extension, m)), before, after).then(n => n).catch(() => false);
            },
            configurable: true
        });

        Object.defineProperty(this, "pinMessage", {
            value: function (message) {
                if (!channel.guild.shard.client.hasBotPermission(channel, "manageMessages")) {
                    return Promise.resolve(false);
                }
                message = resolveMsg(message);
                return channel.pinMessage(message).then(() => true).catch(() => false);
            },
            configurable: true
        });

        Object.defineProperty(this, "removeMessageReaction", {
            value: function (message, reaction, user) {
                message = resolveMsg(message);
                user = resolveUser(user);
                if (user && user !== channel.guild.shard.client.user.id && 
                    !channel.guild.shard.client.hasBotPermission(channel, "manageMessages")) {
                    return Promise.resolve(false);
                }
                return channel.removeMessageReaction(message, reaction, user).then(() => true).catch(() => false);
            },
            configurable: true
        });

        Object.defineProperty(this, "removeMessageReactions", {
            value: function (message) {
                if (!channel.guild.shard.client.hasBotPermission(channel, "manageMessages")) {
                    return Promise.resolve(false);
                }
                message = resolveMsg(message);
                return channel.removeMessageReactions(message).then(() => true).catch(() => false);
            },
            configurable: true
        });

        Object.defineProperty(this, "sendTyping", {
            value: function () {
                if (!channel.guild.shard.client.hasBotPermission(channel, "sendMessages")) {
                    return Promise.resolve(false);
                }
                return channel.sendTyping().then(() => true).catch(() => false);
            },
            configurable: true
        });

        Object.defineProperty(this, "unpinMessage", {
            value: function (message) {
                if (!channel.guild.shard.client.hasBotPermission(channel, "manageMessages")) {
                    return Promise.resolve(false);
                }
                message = resolveMsg(message);
                return channel.unpinMessage(message).then(() => true).catch(() => false);
            },
            configurable: true
        });
    }
}

module.exports = TextChannel;