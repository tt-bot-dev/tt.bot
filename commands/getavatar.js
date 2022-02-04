/**
 * Copyright (C) 2022 tt.bot dev team
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
const { Command, Eris: { Member, Constants: { ApplicationCommandOptionTypes } } } = require("sosamba");

class AvatarCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "getavatar",
            /*argParser: new SerializedArgumentParser(sosamba, {
                args: [{
                    default: ctx => ctx.author,
                    rest: true,
                    name: "user",
                    type: [User, userByID],
                    description: "the user to get the avatar from"
                }]
            }),*/
            args: [{
                name: "user",
                description: "The user to get the avatar for.",
                type: ApplicationCommandOptionTypes.USER,
                required: true,
            }],
            description: "Gets someone's avatar.",
            aliases: ["avatar"]
        });
    }

    async run(ctx, { user }) {
        // const descString = `${this._getSizeString(128, user)}\n${this._getSizeString(256, user)}\n${this._getSizeString(512, user)}\n${this._getSizeString(1024, user)}`;
        // console.log(descString.length);

        if (user instanceof Member) ({ user } = user);

        const fields = [
            {
                name: "PNG",
                value: this._getEmbedFieldValueString("png", user)
            },
            {
                name: "JPEG",
                value: this._getEmbedFieldValueString("jpg", user)
            },
            {
                name: "WebP",
                value: this._getEmbedFieldValueString("webp", user)
            }
        ];
        if (user.avatar.startsWith("a_")) fields.unshift({
            name: "GIF",
            value: this._getEmbedFieldValueString("gif", user)
        });

        await ctx.send({
            embeds: [{
                //image: 
                author: {
                    name: await ctx.t("USER_AVATAR", {
                        user: this.sosamba.getTag(user)
                    })
                },
                image: {
                    url: user.avatarURL
                },
                // description: descString
                /*description: `PNG: [128x128](${user.dynamicAvatarURL("png", 128)}) [256x256](${user.dynamicAvatarURL("png", 256)}) [512x512](${user.dynamicAvatarURL("png", 512)}) [1024x1024](${user.dynamicAvatarURL("png", 1024)}) [2048x2048](${user.dynamicAvatarURL("png", 2048)}) [4096x4096](${user.dynamicAvatarURL("png", 4096)})
GIF: [128x128](${user.dynamicAvatarURL("gif", 128)}) [256x256](${user.dynamicAvatarURL("gif", 256)}) [512x512](${user.dynamicAvatarURL("gif", 512)}) [1024x1024](${user.dynamicAvatarURL("gif", 1024)}) [2048x2048](${user.dynamicAvatarURL("gif", 2048)}) [4096x4096](${user.dynamicAvatarURL("gif", 4096)})
JPEG: [128x128](${user.dynamicAvatarURL("jpg", 128)}) [256x256](${user.dynamicAvatarURL("jpg", 256)}) [512x512](${user.dynamicAvatarURL("jpg", 512)}) [1024x1024](${user.dynamicAvatarURL("jpg", 1024)}) [2048x2048](${user.dynamicAvatarURL("jpg", 2048)}) [4096x4096](${user.dynamicAvatarURL("jpg", 4096)})
WebP: [128x128](${user.dynamicAvatarURL("webp", 128)}) [256x256](${user.dynamicAvatarURL("webp", 256)}) [512x512](${user.dynamicAvatarURL("webp", 512)}) [1024x1024](${user.dynamicAvatarURL("webp", 1024)}) [2048x2048](${user.dynamicAvatarURL("webp", 2048)}) [4096x4096](${user.dynamicAvatarURL("webp", 4096)})`,*/
            }, {
                fields
            }]
        });
    }

    _getSizeString(size, user) {
        return `${size}x${size}: ${user.avatar.startsWith("a_") ? `[GIF](${user.dynamicAvatarURL("gif", size)})/` : ""}[PNG](${user.dynamicAvatarURL("png", size)})/[JPEG](${user.dynamicAvatarURL("jpg", size)})/[WebP](${user.dynamicAvatarURL("webp", size)})`;
    }

    _getEmbedFieldValueString(format, user) {
        return [128, 256, 512, 1024, 2048].map(size => `[${size}x${size}](${user.dynamicAvatarURL(format, size)})`).join(" | ");
    }
}

module.exports = AvatarCommand;