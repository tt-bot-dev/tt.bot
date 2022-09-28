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



import { Command, Eris } from "sosamba";
import * as Regexes from "../lib/e2p/regexes.mjs";
import UnicodeEmojiRegex from "emoji-regex";
import { t } from "../lib/util.mjs";

const { Constants: { ApplicationCommandOptionTypes } } = Eris;

class EmojiCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: "emoji",
            description: "Render up to 5 emojis as a picture.",
            args: [{
                name: "emojis",
                description: "The emojis to render.",
                type: ApplicationCommandOptionTypes.STRING,
                required: true,
            }, {
                name: "gif",
                description: "Whether to render this GIF as a picture or not.",
                type: ApplicationCommandOptionTypes.BOOLEAN,
                required: false,
            }],
        });
    }

    async run(ctx, { emojis, gif }) {
        this.log.debug(emojis);
        let input = emojis.split(" ").filter(val => Regexes.EmojiRegex.test(val) || UnicodeEmojiRegex().test(val));
        if (input.length > 5) input = input.slice(0, 5);
        
        await ctx.interaction.defer();

        const time = process.hrtime();
        let b;
        try {
            b = await this.sosamba.workers.sendToRandom(0, "generateImage", { input, asGif: gif }).promise;
            if (b && b.err) throw b.err;
        } catch (err) {
            this.log.error(err);
            await ctx.send({
                content: await t(ctx, "ERROR", { error: err.stack ?? err.toString() }),
                flags: 64,
            });
            return;
        }
        if (!b) {
            await ctx.send({
                content: await t(ctx, "IMAGE_NONE"),
                flags: 64,
            });
            return;
        }
        const hrtime = process.hrtime(time);
        
        await ctx.send({
            embeds: [{
                description: "Enjoy!",
                color: 0x008800,
                image: {
                    url: `attachment://image${b.isGif ? ".gif" : ".png"}`,
                },
                fields: b.generated ? [{
                    name: await t(ctx, "IMAGE_AUTO_GENERATED"),
                    value: await t(ctx, "IMAGE_CAVEATS"),
                }] : [],
                footer: {
                    text: await t(ctx, "IMAGE_GENERATION_TIME", {
                        seconds: hrtime[0], 
                        ms: Math.floor(hrtime[1] / 1e6),
                    }),
                },
            }],
        }, {
            file: Buffer.from(b.image),
            name: b.isGif ? "image.gif" : "image.png",
        });
    }
}

export default EmojiCommand;
