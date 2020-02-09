const User = require("./User");
const Base = require("./Base");
const r = require("../Utils/InterceptReason");
class Invite extends Base {
    constructor(extension, invite) {
        super(extension);
        this.code = invite.code;
        this.channel = invite.channel;
        if (invite.guild) this.guild = invite.guild;
        if (invite.inviter) this.inviter = new User(extension, invite.inviter);
        this.uses = invite.uses;
        this.maxUses = invite.maxUses;
        this.maxAge = invite.maxAge;
        this.temporary = invite.temporary;

        Object.defineProperty(this, "createdAt", {
            get: function () {
                return invite.createdAt;
            },
            configurable: true
        });

        this.revoked = invite.revoked;
        this.presenceCount = invite.presenceCount;
        this.memberCount = invite.memberCount;
        Object.defineProperty(this, "delete", {
            value: function (reason) {
                if (!invite._client.guilds.has(invite.guild.id)) return Promise.resolve(false);
                const me = invite._client.guilds.get(invite.guild.id).members.get(invite._client.user.id);
                if (!me.permission.has("manageGuild")) {
                    return Promise.resolve(false);
                }
                return invite.delete(r(extension, reason)).then(() => true).catch(() => false);
            },
            configurable: true
        })
    }
}

module.exports = Invite;