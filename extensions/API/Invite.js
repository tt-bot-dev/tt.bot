const User = require("./User");
const r = require("../Utils/InterceptReason");
class Invite {
    constructor(invite) {
        this.code = invite.code;
        this.channel = invite.channel;
        if (invite.guild) this.guild = invite.guild;
        if (invite.inviter) this.inviter = new User(invite.inviter);
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
                return invite.delete(r(reason)).then(() => true).catch(() => false);
            },
            configurable: true
        })
    }
}

module.exports = Invite;