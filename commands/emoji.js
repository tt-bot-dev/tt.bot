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
                    type: String
                }]
            })
        });
    }
    async run(ctx, emojis) {
        if (emojis.length > 5) emojis = emojis.slice(0,5);
        await ctx.send(ctx.t("IMAGE_GENERATING"));
        const t = process.hrtime();
        let b;
        try {
            b = await this.sosamba.workers.sendToRandom(0, "generateImage", {input: emojis.join(" ")}).promise;
            if (b && b.err) throw b.err;
        } catch(err) {
            //eslint-disable-next-line no-console
            console.error(err);
            ctx.send(ctx.t("ERROR", err));
            return;
        }
        if (!b) {
            ctx.send(ctx.t("IMAGE_NONE"));
            return;
        }
        const hrtime = process.hrtime(t);
        ctx.send({
            embed: {
                description: "Enjoy!",
                color: 0x008800,
                image: {
                    url: `attachment://${b.animated ? "image.gif" : "image.png"}`
                },
                fields: b.generated ? [{
                    name: ctx.t("IMAGE_AUTO_GENERATED"),
                    value: ctx.t("IMAGE_CAVEATS")
                }] : [],
                footer: {
                    text: ctx.t("IMAGE_GENERATION_TIME", ...hrtime)
                }
            }
        }, {
            file: Buffer.from(b.image, "base64"),
            name: b.animated ? "image.gif" : "image.png"
        });
    }
}

module.exports = EmojiCommand;