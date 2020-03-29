/**
 * Copyright (C) 2020 tt.bot dev team
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
const resolveId = require("../Utils/ResolveUserID");
const checkPermission = require("../Utils/CheckPrivilege");
const InterceptReason = require("../Utils/InterceptReason");
const Base = require("./Base");
let TextChannel, Member, User, Guild;
process.nextTick(() => {
    TextChannel = require("./TextChannel");
    Member = require("./Member");
    User = require("./User");
    Guild = require("./Guild");
});
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
        });
        this.channelMentions = msg.channelMentions.map(c => this.guild.channels.get(c));
        this.cleanContent = msg.cleanContent;
        this.content = msg.content;
        this.editedTimestamp = msg.editedTimestamp;
        this.embeds = msg.embeds;
        this.guild = new Guild(extension, msg.channel.guild);
        this.member = new Member(extension, msg.member);
        this.mentionEveryone = msg.mentionEveryone;
        this.mentions = msg.mentions.map(u => new User(extension, u));
        this.mentionsMembers = msg.mentions.map(u => this.guild.members.get(u));
        this.messageReference = msg.messageReference;
        this.pinned = msg.pinned;
        this.reactions = msg.reactions;
        this.roleMentions = msg.roleMentions.map(r => this.guild.roles.get(r));
        this.timestamp = msg.timestamp;
        this.tts = msg.tts;
        this.type = msg.type;

        Object.defineProperty(this, "delete", {
            value: function (reason) {
                try {
                    checkPermission(extension, "guildModerative");
                } catch (e) {
                    return Promise.reject(e);
                }
                if (msg.author.id !== msg.channel.guild.shard.client.user.id && !msg.channel.guild.shard.client.hasBotPermission(msg.channel, "manageMessages")) {
                    return Promise.resolve(false);
                }
                return msg.delete(InterceptReason(extension, reason)).then(() => true).catch(() => false);
            },
            configurable: true
        });

        Object.defineProperty(this, "pin", {
            value: function () {
                try {
                    checkPermission(extension, "guildModerative");
                } catch (e) {
                    return Promise.reject(e);
                }
                if (!msg.channel.guild.shard.client.hasBotPermission(msg.channel, "manageMessages")) {
                    return Promise.resolve(false);
                }
                msg.pin().then(() => true).catch(() => false);
            },
            configurable: true
        });

        Object.defineProperty(this, "unpin", {
            value: function () {
                try {
                    checkPermission(extension, "guildModerative");
                } catch (e) {
                    return Promise.reject(e);
                }
                if (!msg.channel.guild.shard.client.hasBotPermission(msg.channel, "manageMessages")) {
                    return Promise.resolve(false);
                }
                msg.unpin().then(() => true).catch(() => false);
            },
            configurable: true
        });

        Object.defineProperty(this, "getReaction", {
            value: function (reaction, limit, before, after) {
                if (before && after) return Promise.reject(false);
                return msg.getReaction(reaction, limit, before, after).then(u => u.map(user => new User(extension, user))).catch(() => false);
            },
            configurable: true
        });

        Object.defineProperty(this, "addReaction", {
            value: function (reaction) {
                if (!msg.channel.guild.shard.client.hasBotPermission(msg.channel, "addReactions")) {
                    return Promise.resolve(false);
                }
                return msg.addReaction(reaction).then(() => true).catch(() => false);
            },
            configurable: true
        });

        Object.defineProperty(this, "removeReaction", {
            value: function (reaction, user) {
                try {
                    checkPermission(extension, "guildModerative");
                } catch (e) {
                    return Promise.reject(e);
                }
                user = resolveId(user);
                if (user && user !== msg.channel.guild.shard.client.user.id &&
                    !msg.channel.guild.shard.client.hasBotPermission(msg.channel, "manageMessages")) {
                    return Promise.resolve(false);
                }
                return msg.removeReaction(reaction, user).then(() => true).catch(() => false);
            },
            configurable: true
        });

        Object.defineProperty(this, "removeReactions", {
            value: function () {
                try {
                    checkPermission(extension, "guildModerative");
                } catch (e) {
                    return Promise.reject(e);
                }
                if (!msg.channel.guild.shard.client.hasBotPermission(msg.channel, "addReactions")) {
                    return Promise.resolve(false);
                }
                return msg.removeReactions().then(() => true).catch(() => false);
            },
            configurable: true
        });

        Object.defineProperty(this, "edit", {
            value: function (content) {
                if (msg.author.id !== msg.channel.guild.shard.client.user.id) {
                    return Promise.resolve(false);
                }
                return msg.edit(content).then(m => new Message(extension, m)).catch(() => false);
            },
            configurable: true
        });

        Object.defineProperty(this, "reply", {
            value: function (content, file) {
                const _content = typeof content === "string" ? {content} :Object.assign({}, content);
                if (!checkPermission(extension, "mentionEveryone", false)) {
                    _content.allowedMentions = {
                        everyone: false,
                        roles: false,
                        users: [msg.author.id]
                    };
                }
                return msg.channel.createMessage(_content, file).then(m => new Message(extension, m)).catch(() => false);
            },
            configurable: true
        });
    }
}
module.exports = Message;