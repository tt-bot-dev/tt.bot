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
const { Command, SerializedArgumentParser, ParsingError } = require("sosamba");
const { version: sosambaVersion } = require("sosamba/package.json");
const URLRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/;
const ImageExtensionRegex = /\.(?:png|jpg|bmp)$/i;
const { read, MIME_JPEG } = require("jimp");
const URLResolver = str => {
    if (!URLRegex.test(str)) throw new ParsingError("The input is not an URL");
    if (!ImageExtensionRegex.test(str)) throw new ParsingError("The input is an invalid or unsupported image. The valid formats are PNG, JPEG and BMP.");
    return str;
};
URLResolver.typeHint = "URL/attachment";

class JPEGCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "needsmorejpeg",
            argParser: new SerializedArgumentParser(sosamba, {
                args: [
                    {
                        name: "url",
                        type: URLResolver,
                        default: ctx => {
                            const images = ctx.msg.attachments.filter(i => i.height && i.width);
                            return images.length > 0 && ImageExtensionRegex.test(images[0].url) && images[0].url;
                        },
                        description: "a link to the image or an attached image"
                    }
                ]
            }),
            description: "Do your pictures need more JPEG? :eyes: Give them to us and we'll handle it for you!",
            aliases: ["jpg", "jpeg"]
        });
    }

    async run(ctx, [url]) {
        if (!url) {
            await ctx.send({
                embed: {
                    title: ":x: Argument required",
                    description: "The argument `url` is required.",
                    color: 0xFF0000,
                    footer: {
                        text: `Sosamba v${sosambaVersion}`
                    }
                }
            });
            return;
        }

        await ctx.channel.sendTyping();
        let image;
        try {
            image = await read(url);
        } catch (err) {
            await ctx.send({
                embed: {
                    title: await ctx.t("CANNOT_JPEGIFY"),
                    description: await ctx.t("CANNOT_FETCH_IMAGE"),
                    color: 0xFF0000
                }
            });
            return;
        }
        image.quality(Math.random() * 5 + 1);
        let file;
        try {
            file = await image.getBufferAsync(MIME_JPEG);
        } catch (err) {
            await ctx.send({
                embed: {
                    title: await ctx.t("CANNOT_JPEGIFY_INTERNAL_ERROR"),
                    description: await ctx.t("SORRY"),
                    color: 0xFF0000
                }
            });
            return;
        }
        await ctx.send("", { file, name: "needsmorejpeg.jpg" });
    }
}

module.exports = JPEGCommand;
