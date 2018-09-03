const Message = require("./Message");
let Guild;
const User = require("./User");
const Role = require("./Role")
const r = require("../Utils/InterceptReason");
const ResolveRoleID = require("../Utils/ResolveRoleID");
process.nextTick(() => {
    Guild = require("./Guild");
})
class Member {
    constructor(member) {
        this.avatar = member.avatar;
        this.avatarURL = member.avatarURL;
        this.bot = member.bot;
        this.createdAt = member.createdAt;
        this.defaultAvatar = member.defaultAvatar;
        this.defaultAvatarURL = member.defaultAvatarURL;
        this.discriminator = member.discriminator;
        this.game = member.game;
        Object.defineProperty(this, "guild", {
            get: function () {
                return new Guild(member.guild);
            },
            configurable: true
        });
        this.id = member.id;
        this.joinedAt = member.joinedAt;
        this.mention = member.mention;
        this.nick = member.nick;
        this.permission = member.permission; // This is safe to do for the time being
        this.roles = member.roles.map(r => new Role(member.guild.roles.get(r)));
        this.staticAvatarURL = member.staticAvatarURL;
        this.status = member.status;
        Object.defineProperty(this, "user", {
            get: function () {
                return new User(member.user);
            },
            configurable: true
        })
        this.username = member.username;
        this.voiceState = member.voiceState; // This is also safe

        // We do not need to share a global variable anymore!
        Object.defineProperty(this, "addRole", {
            value: function (role, reason) {
                role = ResolveRoleID(role);
                return member.addRole(role, r(reason)).then(() => true).catch(() => false);
            },
            configurable: true
        })

        Object.defineProperty(this, "ban", {
            value: function (deleteMessageDays, reason) {
                return member.ban(deleteMessageDays, r(reason)).then(() => true).catch(() => false);
            },
            configurable: true
        })

        Object.defineProperty(this, "edit", {
            value: function (options, reason) {
                const o = Object.assign({}, options);
                if (o.roles) o.roles = o.roles.map(r => ResolveRoleID(r))
                return member.edit(o, r(reason)).then(() => true).catch(() => false);
            },
            configurable: true
        })

        Object.defineProperty(this, "kick", {
            value: function (reason) {
                return member.kick(r(reason)).then(() => true).catch(() => false);
            },
            configurable: true
        })

        Object.defineProperty(this, "removeRole", {
            value: function (role, reason) {
                role = ResolveRoleID(role);
                return member.removeRole(role, r(reason)).then(() => true).catch(() => false);
            },
            configurable: true
        })

        Object.defineProperty(this, "unban", {
            value: function (reason) {
                return member.unban(r(reason)).then(() => true).catch(() => false);
            },
            configurable: true
        })

        Object.defineProperty(this, "createMessage", {
            value: function (content, file) {
                // Save us a request
                if (this.bot) return Promise.reject(false);
                return member.user.getDMChannel().then(dm => dm.createMessage(content, file)).then(m => new Message(m)).catch(() => false);
            },
            configurable: true
        })
    }
    
    toString() {
        return this.mention;
    }
}
module.exports = Member;