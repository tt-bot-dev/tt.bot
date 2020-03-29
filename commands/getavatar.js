/**
 * Copyright (C) 2020 tt.bot dev team
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
const { Command, SerializedArgumentParser,
    Serializers: { User } } = require("sosamba");
const userByID = require("../lib/util/userByID");

class AvatarCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "getavatar",
            argParser: new SerializedArgumentParser(sosamba, {
                args: [{
                    default: ctx => ctx.author,
                    rest: true,
                    name: "user",
                    type: [User, userByID],
                    description: "the user to get the avatar from"
                }]
            }),
            description: "Gets someone's avatar.",
            aliases: ["avatar"]
        });
    }

    async run(ctx, [user]) {
        await ctx.send({
            embed: {
                author: {
                    name: await ctx.t("USER_AVATAR", this.sosamba.getTag(user))
                },
                image: {
                    url: user.avatarURL
                },
                description: await ctx.t("AVATAR_NOT_LOADING", user.dynamicAvatarURL("png", 2048))
            }
        });
    }
}

module.exports = AvatarCommand;