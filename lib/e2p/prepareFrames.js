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
const GifWrap = require("gifwrap");
const { ImageFrame } = require("jimp-upng");
const Jimp = require("jimp");
const { AUTO } = Jimp;
module.exports = async (result, b) => {
    let frames = [];
    let ogGif;
    if (Buffer.isBuffer(b)) {
        const c = new GifWrap.GifCodec();
        const gif = await c.decodeGif(b);
        frames = gif.frames.map(f => 
            ImageFrame.createFromJIMP(f, {
                dispose: f.disposalMethod,
                delay: f.delayCentisecs * 10,
                rect: {
                    x: f.xOffset,
                    y: f.yOffset,
                }
            })
        );
        ogGif = gif;
    } else if (b instanceof ImageFrame) {
        frames = [b];
    } else throw new Error("The buffer must be an ImageFrame or a Buffer");
    frames.map(g => new Promise((rs, rj) => new Jimp(g.bitmap.width, g.bitmap.height, (e, image) => {
        if (e) rj(e);
        image.bitmap = g.bitmap;
        const w = result.type === "unicodeEmote" ? 72 : 128;
        image.resize(w,AUTO);
        rs(ImageFrame.createFromJIMP(image));
    })
    ));
    return {
        frames: await Promise.all(frames),
        ogGif
    };
    
};