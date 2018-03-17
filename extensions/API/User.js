let origUser = null;
const Message = require("./Message");
class User {
    constructor(user) {
        origUser = user;
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
    }

    // noinspection JSMethodCanBeStatic
    dynamicAvatarURL(format, size) {
        return origUser.dynamicAvatarURL(format, size);
    }

    createMessage(content, file) {
        if (this.bot) return Promise.reject({
            code: 50017,
            message: "Cannot send messages to this user"
        });
        return origUser.getDMChannel().then(dm => dm.createMessage(content, file)).then(m => new Message(m)).catch(() => false);
    }
}
module.exports = User;