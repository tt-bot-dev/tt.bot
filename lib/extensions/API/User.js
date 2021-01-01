/**
 * Copyright (C) 2021 tt.bot dev team
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
                const _content = typeof content === "string" ? { content } :Object.assign({}, content);
                if (!checkPermission(extension, "mentionEveryone", false)) {
                    _content.allowedMentions = {
                        everyone: false,
                        roles: false,
                        users: [user.id]
                    };
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