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
            file: Buffer.from(b.image),
            name: b.isGif ? "image.gif" : "image.png"
        });
    }
}

module.exports = EmojiCommand;