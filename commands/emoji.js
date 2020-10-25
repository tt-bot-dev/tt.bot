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
const { Command, SerializedArgumentParser, ParsingError } = require("sosamba");
const Regexes = require("../lib/e2p/regexes");
const UnicodeEmojiRegex = require("emoji-regex");
const EmojiSerializer = val => {
    if (Regexes.EmojiRegex.test(val) ||
        UnicodeEmojiRegex().test(val) ||
        val === "--gif") return val;
    throw new ParsingError("Invalid emoji");
};

EmojiSerializer.typeHint = "Emoji";

class EmojiCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "emoji",
            argParser: new SerializedArgumentParser(sosamba, {
                separator: " ",
                filterEmptyArguments: true,
                args: [{
                    name: "doGif",
                    type: Boolean,
                    description: "whether to generate a GIF image or not"
                },
                {
                    name: "emojis",
                    restSplit: true,
                    type: EmojiSerializer,
                    description: "the emojis to convert into a picture"
                }],
                allowQuotedString: false
            }),
            description: "Render up to 5 emojis as a picture.",
            aliases: ["e2p"]
        });
    }
    async run(ctx, [asGif, ...input]) {
        if (input.length > 5) input = input.filter(t => t !== "--gif").slice(0, 5);
        await ctx.send(await ctx.t("IMAGE_GENERATING"));
        const t = process.hrtime();
        let b;
        try {
            b = await this.sosamba.workers.sendToRandom(0, "generateImage", { input, asGif }).promise;
            if (b && b.err) throw b.err;
        } catch (err) {
            this.log.error(err);
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
                    url: `attachment://image${b.isGif ? ".gif" : ".png"}`
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
