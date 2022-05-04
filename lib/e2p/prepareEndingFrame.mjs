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


import e2p from "@tt-bot-dev/e2p";
const { compositeImage } = e2p;

const fill = (array, times) => {
    const outputArr = [];
    for (let i = 0; i < array.length; i++) {
        if (array[i].delay && array[i].delay !== 20) {
            for (let j = 0; j < Math.max(Math.floor(array[i].delay / 20), 1); j++) {
                outputArr.push(array[i]);
            }
        } else {
            outputArr.push(array[i]);
        }
    }
    const copy = outputArr.slice();
    for (let i = 0; i < times; i++) Array.prototype.push.apply(outputArr, copy);
    return outputArr;
};

/**
 * @param {number} totalWidth
 * @param {number} height
 * @param {import("@tt-bot-dev/e2p").Image[][]} imgs
 * @param {number} frames
 */
export default async (totalWidth, height, imgs, frames) => {
    /** @type {import("@tt-bot-dev/e2p").Image[][]} */
    const images = imgs.map(f => fill(f, Math.floor(frames / f.length) + 1));
    const composite = async (i) => {
        let pos = 0;
        //const oneLargeImage = new Jimp(total, height);
        let bitmap = {
            data: Buffer.alloc(totalWidth * height * 4),
            height,
            width: totalWidth,
        };
        for (let j = 0; j < images.length; j++) {
            const usedImage = (images[j][i] || images[j][0]).bitmap;

            const y = (height / 2) - (usedImage.height / 2);

            bitmap = await compositeImage(
                bitmap,
                usedImage,
                pos,
                y,
            );
            pos += images[j][0].bitmap.width + 8;
        }
        return bitmap;
    };

    const p = [];
    for (let i = 0; i < frames; i++) p.push(composite(i));
    const f = await Promise.all(p);
    return f;
};
