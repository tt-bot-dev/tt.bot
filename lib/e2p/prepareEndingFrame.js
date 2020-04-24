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
const Jimp = require("jimp");
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
    for (let i = 0; i <times; i++) copy.forEach(c => outputArr.push(c));
    return outputArr;
};
module.exports = async (total, height, imgs, frames) => {
    let f = [];
    const images = imgs.map(f => fill(f, Math.floor(frames / f.length)+1));
    for (let i = 0; i < frames; i++) {
        let pos = 0;
        function getPixl(i) {
            let aPos = pos;
            pos += images[i][0].bitmap.width + 8;
            return aPos;
        }
        const oneLargeImage = new Jimp(total, height);
        const imgMap = images.map(f => {
            if (f[i]) return f[i];
            else return f[0];
        });
        imgMap.forEach((f, idx) => {
            const ima = new Jimp(1, 1, 0);
            ima.bitmap = f.bitmap;
            oneLargeImage.composite(ima, getPixl(idx), 0);
        });
        f.push(ImageFrame.createFromJIMP(oneLargeImage, {
            delay: 20
        }));
    }
    return f;
};