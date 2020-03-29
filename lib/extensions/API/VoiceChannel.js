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