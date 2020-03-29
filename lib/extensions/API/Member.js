"use strict";
const Message = require("./Message");
let Guild;
const User = require("./User");
const Role = require("./Role");
const r = require("../Utils/InterceptReason");
const ResolveRoleID = require("../Utils/ResolveRoleID");
const checkPermission = require("../Utils/CheckPrivilege");
const Base = require("./Base");
process.nextTick(() => {
    Guild = require("./Guild");
});
class Member extends Base {
    constructor(extension, member) {
        super(extension, member);
        this.activities = member.activities;
        this.avatar = member.avatar;
        this.avatarURL = member.avatarURL;
        this.bot = member.bot;
        this.clientStatus = member.clientStatus;
        this.defaultAvatar = member.defaultAvatar;
        this.defaultAvatarURL = member.defaultAvatarURL;
        this.discriminator = member.discriminator;
        this.game = member.game;
        Object.defineProperty(this, "guild", {
            get: function () {
                return new Guild(extension, member.guild);
            },
            configurable: true
        });
        this.joinedAt = member.joinedAt;
        this.mention = member.mention;
        this.nick = member.nick;
        this.permission = member.permission; // This is safe to do for the time being
        this.roles = member.roles.map(r => new Role(extension, member.guild.roles.get(r)));
        this.staticAvatarURL = member.staticAvatarURL;
        this.status = member.status;
        Object.defineProperty(this, "user", {
            get: function () {
                return new User(extension, member.user);
            },
            configurable: true
        });
        this.username = member.username;
        this.voiceState = member.guild.voiceStates.get(member.id); // This is also safe

        Object.defineProperty(this, "addRole", {
            value: function (role, reason) {
                try {
                    checkPermission(extension, "guildMembersMeta");
                } catch (e) {
                    return Promise.reject(e);
                }
                const me = member.guild.members.get(member.guild.shard.client.user.id);
                role = ResolveRoleID(role);
                if (!me.permission.has("manageRoles")
                    || !member.guild.shard.client.passesRoleHierarchy(me, {
                        guild: member.guild,
                        roles: [role]
                    })) {
                    return Promise.resolve(false);
                }
                return member.addRole(role, r(extension, reason)).then(() => true).catch(() => false);
            },
            configurable: true
        });

        Object.defineProperty(this, "ban", {
            value: function (deleteMessageDays, reason) {
                try {
                    checkPermission(extension, "guildModerative");
                } catch (e) {
                    return Promise.reject(e);
                }
                const me = member.guild.members.get(member.guild.shard.client.user.id);
                if (!me.permission.has("banMembers")
                    || !member.guild.shard.client.passesRoleHierarchy(me, member)) {
                    return Promise.resolve(false);
                }
                return member.ban(deleteMessageDays, r(extension, reason)).then(() => true).catch(() => false);
            },
            configurable: true
        });

        Object.defineProperty(this, "edit", {
            value: function (options, reason) {
                try {
                    checkPermission(extension, "guildMembersMeta");
                } catch (e) {
                    return Promise.reject(e);
                }
                const me = member.guild.members.get(member.guild.shard.client.user.id);
                if (!member.guild.shard.client
                    .passesRoleHierarchy(me, member)) {
                    return Promise.resolve(false);
                }
                const o = Object.assign({}, options);
                if (o.roles) o.roles = o.roles.map(r => ResolveRoleID(r));
                return member.edit(o, r(extension, reason)).then(() => true).catch(() => false);
            },
            configurable: true
        });

        Object.defineProperty(this, "kick", {
            value: function (reason) {
                try {
                    checkPermission(extension, "guildModerative");
                } catch (e) {
                    return Promise.reject(e);
                }
                const me = member.guild.members.get(member.guild.shard.client.user.id);
                if (!member.guild.shard.client
                    .passesRoleHierarchy(me, member)) {
                    return Promise.resolve(false);
                }
                return member.kick(r(extension, reason)).then(() => true).catch(() => false);
            },
            configurable: true
        });

        Object.defineProperty(this, "removeRole", {
            value: function (role, reason) {
                try {
                    checkPermission(extension, "guildMembersMeta");
                } catch (e) {
                    return Promise.reject(e);
                }
                const me = member.guild.members.get(member.guild.shard.client.user.id);
                role = ResolveRoleID(role);
                if (!me.permission.has("manageRoles")
                    || !member.guild.shard.client.passesRoleHierarchy(me, {
                        guild: member.guild,
                        roles: [role]
                    })) {
                    return Promise.resolve(false);
                }
                return member.removeRole(role, r(extension, reason)).then(() => true).catch(() => false);
            },
            configurable: true
        });

        Object.defineProperty(this, "unban", {
            value: function (reason) {
                try {
                    checkPermission(extension, "guildModerative");
                } catch (e) {
                    return Promise.reject(e);
                }
                return member.unban(r(extension, reason)).then(() => true).catch(() => false);
            },
            configurable: true
        });

        Object.defineProperty(this, "strike", {
            value: function (reason) {
                try {
                    checkPermission(extension, "guildModerative");
                } catch (e) {
                    return Promise.reject(e);
                }
                if (!reason) return Promise.resolve(false);
                return member.guild.shard.client.modLog.addStrikeExtension(member.id, member.guild, r(extension, reason)).then(() => true).catch(() => false);
            },
            configurable: true
        });

        Object.defineProperty(this, "createMessage", {
            value: function (content, file) {
                if (this.bot) return Promise.resolve(false);
                const _content = typeof content === "string" ? {content} :Object.assign({}, content);
                if (!checkPermission(extension, "mentionEveryone", false)) {
                    _content.allowedMentions = {
                        everyone: false,
                        roles: false,
                        users: [msg.author.id]
                    }
                }
                return member.user.getDMChannel().then(dm => dm.createMessage(_content, file))
                .then(m => new Message(extension, m)).catch(() => false);
            },
            configurable: true
        });
    }
    
    toString() {
        return this.mention;
    }
}
module.exports = Member;