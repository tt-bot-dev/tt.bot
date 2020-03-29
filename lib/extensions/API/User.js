"use strict";
const Message = require("./Message");
const Base = require("./Base");
const checkPermission = require("../Utils/CheckPrivilege");
class User extends Base {
    constructor(extension, user) {
        super(extension, user);
        this.avatar = user.avatar;
        this.avatarURL = user.avatarURL;
        this.bot = user.bot;
        this.defaultAvatar = user.defaultAvatar;
        this.defaultAvatarURL = user.defaultAvatarURL;
        this.discriminator = user.discriminator;
        this.mention = user.mention;
        this.staticAvatarURL = user.staticAvatarURL;
        this.username = user.username;

        Object.defineProperty(this, "dynamicAvatarURL", {
            value: function (format, size) {
                return user.dynamicAvatarURL(format, size);
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
                return user.getDMChannel().then(dm => dm.createMessage(_content, file))
                .then(m => new Message(extension, m)).catch(() => false);
            },
            configurable: true
        });
    }

    toString() {
        return this.mention;
    }
}
module.exports = User;