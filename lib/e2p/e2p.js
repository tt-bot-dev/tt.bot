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
const apngPlugin = require("jimp-upng");
const {
    EmojiRegex,
} = require("./regexes");
const prepareFrames = require("./prepareFrames");
const endFrame = require("./prepareEndingFrame");
const computeFrameCount = require("./computeFrameCount");
const chainfetch = require("chainfetch");
const convertSurrogates = require("./convertSurrogates");
const { encodeAPNG, encodeGIF, decodePNG } = require("@tt-bot-dev/e2p");

/**
 * @type {Map<string, { cachedAt: number, resp: Response }>}
 */
const emojiCache = new Map();
const getAndCache = async emojiLink => {
    if (!emojiCache.has(emojiLink)) {
        return chainfetch.get(emojiLink).toBuffer()
            .then(resp => {
                emojiCache.set(emojiLink, {
                    cachedAt: Date.now(),
                    resp,
                });
                return resp;
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
                            url: `https://twitter.github.io/twemoji/2/72x72/${
                                convertSurrogates(emoji)
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
            image: (await getAndCache(resolvedEmojis[0].url)).body,
            animated: resolvedEmojis[0].animated,
            isGif: resolvedEmojis[0].type === "discordCustomEmoji" && resolvedEmojis[0].animated,
        };
    }
    const imgs = await Promise.all(resolvedEmojis.map(r => {
        if (r.animated) {
            return getAndCache(r.url).then(e => {
                return prepareFrames(r, e.body);
            });
        }
        return getAndCache(r.url)
            .then(d => decodePNG(d.body))
            .then(i =>
                prepareFrames(
                    r,
                    apngPlugin.ImageFrame.createFromJIMP({
                        bitmap: i,
                    }),
                )
            );
    }));
    resolvedEmojis = null;
    let total = 0;

    const imageCopy = imgs.slice();
    // How to create a gif with frames of different size :thinking:
    const height =
    imageCopy.sort((a, b) => b[0].bitmap.height - a[0].bitmap.height)[0][0]
        .bitmap.height;
    const frames = computeFrameCount(
        imageCopy.sort((a, b) => computeFrameCount(b) - computeFrameCount(a))[0],
    );

    for (let i = 0; i < imgs.length; i++) {
        if (i === 0) total += imgs[i][0].bitmap.width;
        else total += imgs[i][0].bitmap.width + 8;
    }
    const totalFrames = await endFrame(total, height, imgs, frames);

    const animated = totalFrames.length !== 1;
    const generated = totalFrames.length > 1;

    const ht = process.hrtime();
    const image = asGif
        ? await encodeGIF(totalFrames)
        : await encodeAPNG(totalFrames);
    const ht2 = process.hrtime(ht);
    console.log(ht2);

    return {
        image: image.buffer,
        animated,
        generated,
        isGif: asGif,
    };
};
module.exports = generate;
