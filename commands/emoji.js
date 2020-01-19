"use strict";
const { Command, SerializedArgumentParser } = require("sosamba");

class EmojiCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "emoji",
            argParser: new SerializedArgumentParser(sosamba, {
                separator: " ",
                filterEmptyArguments: true,
                args: [{
                    name: "emojis",
                    rest: true,
                    type: String,
                    description: "the emojis to convert into a picture"
                }]
            }),
            description: "Render up to 5 emojis as a picture."
        });
    }
    async run(ctx, [emojis]) {
        await ctx.send(await ctx.t("IMAGE_GENERATING"));
        const t = process.hrtime();
        let b;
        try {
            b = await this.sosamba.workers.sendToRandom(0, "generateImage", {input: emojis}).promise;
            if (b && b.err) throw b.err;
        } catch(err) {
            //eslint-disable-next-line no-console
            console.error(err);
            ctx.send(await ctx.t("ERROR", err));
            return;
        }
        if (!b) {
            ctx.send(await ctx.t("IMAGE_NONE"));
            return;
        }
        const hrtime = process.hrtime(t);
        ctx.send({
            embed: {
                description: "Enjoy!",
                color: 0x008800,
                image: {
                    url: `attachment://image${b.isGif ? ".gif" :".png"}`
                },
                fields: b.generated ? [{
                    name: await ctx.t("IMAGE_AUTO_GENERATED"),
                    value: await ctx.t("IMAGE_CAVEATS")
                }] : [],
                footer: {
                    text: await ctx.t("IMAGE_GENERATION_TIME", ...hrtime)
                }
            }
        }, {
            file: Buffer.from(b.image, "base64"),
            name: b.isGif ? "image.gif" : "image.png"
        });
    }
}

module.exports = EmojiCommand;