const Message = require("./Message");
class User {
    constructor(user) {
        this.avatar = user.avatar;
        this.avatarURL = user.avatarURL;
        this.bot = user.bot;
        this.createdAt = user.createdAt;
        this.defaultAvatar = user.defaultAvatar;
        this.defaultAvatarURL = user.defaultAvatarURL;
        this.discriminator = user.discriminator;
        this.id = user.id;
        this.mention = user.mention;
        this.staticAvatarURL = user.staticAvatarURL;
        this.username = user.username;

        // We do not need to share a global variable anymore!
        Object.defineProperty(this, "dynamicAvatarURL", {
            value: function (format, size) {
                return user.dynamicAvatarURL(format, size);
            },
            configurable: true
        })

        Object.defineProperty(this, "createMessage", {
            value: function (content, file) {
                // Save us a request
                if (this.bot) return Promise.reject(false);
                return user.getDMChannel().then(dm => dm.createMessage(content, file)).then(m => new Message(m)).catch(() => false);
            },
            configurable: true
        })
    }

    toString() {
        return this.mention;
    }
}
module.exports = User;