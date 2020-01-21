"use strict";
const { Command, SerializedArgumentParser, ParsingError } = require("sosamba");
const URLRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/;
const ImageExtensionRegex = /\.(?:png|jpg|bmp)$/i;
const { read, MIME_JPEG } = require("jimp");

class JPEGCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "needsmorejpeg",
            argParser: new SerializedArgumentParser(sosamba, {
                args: [
                    {
                        name: "url",
                        type: str => {
                            if (!URLRegex.test(str)) throw new ParsingError("The input is not an URL");
                            if (!ImageExtensionRegex.test(str)) throw new ParsingError("The input is an invalid or unsupported image. The valid formats are PNG, JPEG and BMP.");
                            return str;
                        },
                        default: ctx => {
                            const images = ctx.msg.attachments.filter(i => i.height && i.width);
                            return images.length > 0 && ImageExtensionRegex.test(images[0].url) && images[0].url;
                        },
                        description: "a link to the image or an attached image"
                    }
                ]
            }),
            description: "Do your pictures need more JPEG? :eyes: Give them to us and we'll handle it for you!",
            aliases: ["jpg"]
        });
    }

    async run(ctx, [url]) {
        if (!url) {
            await ctx.send(await ctx.t("ARGS_MISSING"));
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
        image.quality((Math.random() * 5) + 1);
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