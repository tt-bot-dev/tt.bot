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


import jimpUpng from "jimp-upng";
import e2p from "@tt-bot-dev/e2p";

const { ImageFrame } = jimpUpng;
const { resizeImage, decodeGIF } = e2p;

export default async (result, b) => {
    let frames = [];
    if (Buffer.isBuffer(b)) {
        const gifFrames = await decodeGIF(b);
        frames = gifFrames.map(f =>
            ImageFrame.createFromJIMP({
                bitmap: {
                    width: f.width,
                    height: f.height,
                    data: f.data,
                },
            }, {
                delay: f.delay,
                rect: {
                    x: f.x,
                    y: f.y,
                },
            })
        );
    //ogGif = gif;
    } else if (b instanceof ImageFrame) {
        frames = [b];
    } else throw new Error("The buffer must be an ImageFrame or a Buffer");
    frames = frames.map(async g => {
        const w = result.type === "unicodeEmote" ? 72 : 128;
        //const w = 128;

        const image = {
            bitmap: await resizeImage(g.bitmap, w),
        };
        return ImageFrame.createFromJIMP(image, {
            delay: g.delay,
            blend: g.blend,
            dispose: g.dispose,
        });
    });
    return Promise.all(frames);
};
