"use strict";
const { Command, SerializedArgumentParser, ParsingError } = require("sosamba");
const URLRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/;
const ImageExtensionRegex = /\.(?:png|jpg|bmp)$/i;

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
                            return images.length > 0 && images[0].url;
                        }
                    }
                ]
            })
        });
    }

    async run(ctx, [url]) {
        if (!url) {
            await ctx.send(ctx.t("ARGS_MISSING"));
            return;
        }

        await ctx.channel.sendTyping();
        const { read, MIME_JPEG } = require("jimp");
        let image;
        try {
            image = await read(url);
        } catch (err) {
            await ctx.send({
                embed: {
                    title: ":x: Cannot JPEG-ify the image",
                    description: "The image cannot be fetched.",
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
                    title: ":x: Cannot JPEG-ify the image due to an internal error",
                    description: "We're sorry for that.",
                    color: 0xFF0000
                }
            });
            return;
        }
        await ctx.send("", { file, name: "needsmorejpeg.jpg" });
    }
}

module.exports = JPEGCommand;