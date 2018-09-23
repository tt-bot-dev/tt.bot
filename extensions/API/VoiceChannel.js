const {Collection} = require("eris");
const Channel = require("./Channel");
const Invite = require("./Invite");
const Member = require("./Member");
const r = require("../Utils/InterceptReason");

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
        })

        Object.defineProperty(this, "createInvite", {
            value: function (options, reason) {
                return channel.createInvite(options, r(extension, reason)).then(i => new Invite(extension, i)).catch(() => false);
            },
            configurable: true
        })
        Object.defineProperty(this, "getInvites", {
            value: function () {
                return channel.getInvites().then(i => i.map(inv => new Invite(extension, inv))).catch(() => false);
            },
            configurable: true
        })
    }
}

module.exports = VoiceChannel;