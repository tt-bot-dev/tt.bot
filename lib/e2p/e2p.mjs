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


import { EmojiRegex } from "./regexes.mjs";
import prepareFrames from "./prepareFrames.mjs";
import endFrame from "./prepareEndingFrame.mjs";
import computeFrameCount from "./computeFrameCount.mjs";
import { request } from "undici";
import convertSurrogates from "./convertSurrogates.mjs";
import e2p from "@tt-bot-dev/e2p";

const { encodeAPNG, encodeGIF, decodePNG } = e2p;

/**
 * @type {Map<string, { cachedAt: number, resp: Buffer }>}
 */
const emojiCache = new Map();
const getAndCache = async emojiLink => {
    if (!emojiCache.has(emojiLink)) {
        return request(emojiLink)
            .then(resp => {
                if (resp.statusCode !== 200) {
                    throw new Error("Fetching the emoji has failed");
                }

                return resp.body.arrayBuffer();
            })
            .then(resp => {
                const buf = Buffer.from(resp);
                emojiCache.set(emojiLink, {
                    cachedAt: Date.now(),
                    resp: buf,
                });
                return buf;
            });
    } else {
        const emoji = emojiCache.get(emojiLink);
        if (Date.now() - emoji.cachedAt > 10 * 60000) {
            emojiCache.delete(emojiLink);
        }

        return emoji.resp;
    }
};

setInterval(() => {
    emojiCache.clear();
}, 20 * 60000);

const generate = async (emoji, asGif = false) => {
    const getEmojiLink = (emoji) =>
        new Promise(rs => {
            if (emoji) {
                const emojiRegexMatch = emoji.match(EmojiRegex);
                if (emojiRegexMatch?.length > 0) {
                    const animated = !!emojiRegexMatch[1];
                    rs(
                        {
                            type: "discordCustomEmoji",
                            url: `https://cdn.discordapp.com/emojis/${emojiRegexMatch[2]}${
                                animated
                                    ? ".gif"
                                    : ".png"
                            }`,
                            animated,
                        },
                    );
                } else {
                    rs(
                        {
                            type: "unicodeEmote",
                            url: `https://twitter.github.io/twemoji/v/latest/72x72/${
                                convertSurrogates(
                                    // Get rid of variation selectors, taken from Twemoji itself
                                    emoji.includes("\u200d") ?
                                        emoji :
                                        emoji.replace(/(?:\uFE0F|\uFE0E)/g, ""), 
                                )
                            }.png`,
                        },
                    );
                }
            }
        });
    let resolvedEmojis = (await Promise.all(emoji.map(getEmojiLink))).filter(
        Boolean,
    );
    if (resolvedEmojis.length === 0) throw new Error("No emojis resolved");
    if (resolvedEmojis.length === 1) {
        return {
            image: await getAndCache(resolvedEmojis[0].url),
            animated: resolvedEmojis[0].animated,
            isGif: resolvedEmojis[0].type === "discordCustomEmoji" && resolvedEmojis[0].animated,
        };
    }

    /**
     * @type {import("@tt-bot-dev/e2p").Image[][]}
     */
    let imgs = await Promise.all(resolvedEmojis.map(r => {
        if (r.animated) {
            return getAndCache(r.url).then(e => prepareFrames(r, e));
        }
        return getAndCache(r.url)
            .then(d => decodePNG(d))
            .then(i =>
                prepareFrames(
                    r,
                    i,
                ),
            );
    }));

    resolvedEmojis = null;

    let imageCopy = imgs.slice();
    // How to create a gif with frames of different size :thinking:
    const height = imageCopy.reduce((a, b) => {
        const heightA = a[0].height;
        const heightB = b[0].height;

        return heightA >= heightB ? a : b;
    }, imageCopy[0])[0].height;

    const frames = computeFrameCount(
        imageCopy.reduce((a, b) => {
            const computedFcA = computeFrameCount(a);
            const computedFcB = computeFrameCount(b);

            return computedFcA >= computedFcB ? a : b;
        }, imageCopy[0]),
    );

    const total = imgs.reduce((a, b) => a + b[0].width, 0)
        + (imgs.length - 1) * 8;

    let totalFrames = await endFrame(total, height, imgs, frames);

    const animated = totalFrames.length !== 1;
    const generated = totalFrames.length > 1;

    const ht = process.hrtime();
    const image = asGif
        ? await encodeGIF(totalFrames)
        : await encodeAPNG(totalFrames);
    const ht2 = process.hrtime(ht);
    console.log(ht2);

    totalFrames = null;
    imageCopy = null;
    imgs = null;

    return {
        image: image.buffer,
        animated,
        generated,
        isGif: asGif,
    };
};
export default generate;
