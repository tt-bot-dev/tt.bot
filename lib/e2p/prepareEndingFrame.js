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
const { ImageFrame } = require("jimp-upng");
const { compositeImage } = require("@tt-bot-dev/e2p");
const fill = (array, times) => {
    const outputArr = [];
    for (const img of array) {
        if (img.delay && img.delay !== 20) {
            for (let i = 0; i < Math.max(Math.floor(img.delay / 20), 1); i++) {
                outputArr.push(img);
            }
        } else {
            outputArr.push(img);
        }
    }
    const copy = outputArr.slice();
    for (let i = 0; i < times; i++) copy.forEach(c => outputArr.push(c));
    return outputArr;
};
module.exports = async (total, height, imgs, frames) => {
    const images = imgs.map(f => fill(f, Math.floor(frames / f.length) + 1));
    const f = await Promise.all(Array(frames).fill(void 0).map(async (_, i) => {
        let pos = 0;
        function getPixl(i) {
            let aPos = pos;
            pos += images[i][0].bitmap.width + 8;
            return aPos;
        }
        //const oneLargeImage = new Jimp(total, height);
        let bitmap = {
            data: Buffer.alloc(total * height * 4),
            height,
            width: total
        };
        const imgMap = images.map(f => {
            if (f[i]) return f[i];
            else return f[0];
        });
        for (const i in imgMap) {
            bitmap = await compositeImage(bitmap, imgMap[i].bitmap, getPixl(i), 0);
        }
        return ImageFrame.createFromJIMP({ bitmap }, {
            delay: 20
        });
    }));
    return f;
};