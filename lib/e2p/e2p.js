"use strict";
const apngPlugin = require("jimp-upng");
const Jimp = require("@jimp/custom")({
    plugins: [require("@jimp/plugins")],
    types: [require("@jimp/types"), apngPlugin]
});
const { read, MIME_APNG } = Jimp;
const {
    EmojiRegex,
    EmojiText,
    EmojiSkinToneText,
    EmojiTextSkinTone,
    EmojiSkinToneMobile
} = require("./regexes");
const prepareFrames = require("./prepareFrames");
const endFrame = require("./prepareEndingFrame");
const computeFrameCount = require("./computeFrameCount");
const chainfetch = require("chainfetch");
const convertSurrogates = require("./convertSurrogates");

const generate = async (input = "", emojis) => {
    let emoji = input.split(" ").map(s => s.trim()).filter(i => i !== "");
    if (emoji.length > 5) emoji = emoji.slice(0, 5);
    const getEmojiLink = emoji => new Promise(rs => {
        if (emoji) {
            const emojiRegexMatch = emoji.match(EmojiRegex);
            if (emojiRegexMatch && emojiRegexMatch.length > 0) {
                const animated = !!emojiRegexMatch[1];
                rs({ type: "discordCustomEmoji", url: `https://cdn.discordapp.com/emojis/${emojiRegexMatch[2]}${animated ? ".gif" : ".png"}`, animated });
            } else {
                const emojiMatch = emoji.match(EmojiText);
                if (emojiMatch && emojiMatch.length > 0) {
                    const textSkintone = emoji.match(EmojiSkinToneText);
                    const skinTone = emoji.match(EmojiTextSkinTone);
                    const mobileSkintone = emoji.match(EmojiSkinToneMobile);
                    function stripOut() {
                        if (textSkintone && textSkintone.length > 0) {
                            const emote = textSkintone[1];
                            const skinTone = parseInt(textSkintone[2]) + 1;
                            if (!emojis[emote] || emojis[`skin-tone-${skinTone}`]) return "";
                            return `${emojis[emote]}${emojis[`skin-tone-${skinTone}`]}`;
                        } else if (mobileSkintone && mobileSkintone.length > 0) {
                            const skinTone = parseInt(mobileSkintone[2]) + 1;
                            return `${mobileSkintone[1]}${emojis[`skin-tone-${skinTone}`]}`;
                        } else if (skinTone && skinTone.length > 0) {
                            if (!emojis[skinTone[1]]) return "";
                            else return `${emojis[skinTone[1]]}${skinTone[2]}`;
                        } else { if (!emojis[emoji.replace(/:/g, "")]) return ""; return emojis[emoji.replace(/:/g, "")]; }
                    }
                    const exec = stripOut();
                    if (!exec) rs();
                    rs({ type: "unicodeEmote", url: `https://twitter.github.io/twemoji/2/72x72/${convertSurrogates(exec)}.png` });
                } else rs({ type: "unicodeEmote", url: `https://twitter.github.io/twemoji/2/72x72/${convertSurrogates(emoji)}.png` });
            }
        }
    });
    let resolvedEmojis = (await Promise.all(emoji.map(getEmojiLink))).filter(a => !!a);
    if (resolvedEmojis.length === 0) throw new Error("No emojis resolved");
    if (resolvedEmojis.length === 1) return {
        image: (await chainfetch.get(resolvedEmojis[0].url).toBuffer()).body,
        animated: resolvedEmojis[0].animated,
        isGif: resolvedEmojis[0].type === "discordCustomEmoji"
    };
    let data = await Promise.all(resolvedEmojis.map(r => {
        if (r.animated) return chainfetch.get(r.url).toBuffer().then(e => {
            return prepareFrames(r, e.body);
        });
        return read(r.url).then(i => prepareFrames(r, apngPlugin.ImageFrame.createFromJIMP(i)));
    }));
    resolvedEmojis = null;
    let imgs = data.map(d => d.frames);
    data = null;
    let total = 0;
    // How to create a gif with frames of different size :thinking:
    const height = imgs.slice().sort((a, b) => b[0].bitmap.height - a[0].bitmap.height)[0][0].bitmap.height;
    const frames = computeFrameCount(imgs.slice().sort((a, b) => computeFrameCount(b) - computeFrameCount(a))[0]);

    for (let i = 0; i < imgs.length; i++) {
        if (i === 0) total += imgs[i][0].bitmap.width;
        else total += imgs[i][0].bitmap.width + 8;
    }
    const totalFrames = await endFrame(total, height, imgs, frames);
    imgs = null;
    let img = new Jimp(0,0,1);
    img.bitmap = totalFrames[0].bitmap;
    img.bitmap.frames = totalFrames.slice(1);
    const animated = img.bitmap.frames.length !== 0;
    const generated = img.bitmap.frames.length > 0;
    const image = await img.getBufferAsync(MIME_APNG);
    img = null;
    return {
        image: image.buffer,
        animated,
        generated
    };
};
module.exports = generate;
