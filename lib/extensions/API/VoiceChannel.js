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
const {Collection} = require("eris");
const Channel = require("./Channel");
const Invite = require("./Invite");
const Member = require("./Member");
const r = require("../Utils/InterceptReason");
const checkPermission = require("../Utils/CheckPrivilege");

class VoiceChannel extends Channel {
    constructor(extension, channel) {
        super(extension, channel);
        this.bitrate = channel.bitrate;
        this.userLimit = channel.userLimit;

        Object.defineProperty(this, "voiceMembers", {
            get: function () {
                const coll = new Collection(Member);
                channel.voiceMembers.forEach(m => coll.add(m));
                return coll;
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
                return channel.createInvite(options, r(extension, reason)).then(i => new Invite(extension, i)).catch(() => false);
            },
            configurable: true
        });
        Object.defineProperty(this, "getInvites", {
            value: function () {
                try {
                    checkPermission(extension, "guildSettings");
                } catch (e) {
                    return Promise.reject(e);
                }
                const me = channel.guild.members.get(channel.guild.shard.client.user.id);
                if (!me.permission.has("manageGuild")) {
                    return Promise.resolve(false);
                }
                return channel.getInvites().then(i => i.map(inv => new Invite(extension, inv))).catch(() => false);
            },
            configurable: true
        });
    }
}

module.exports = VoiceChannel;