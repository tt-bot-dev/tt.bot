"use strict";
const GifWrap = require("gifwrap");
const {ImageFrame} = require("jimp-upng");
const Jimp = require("jimp");
const {AUTO} = Jimp;
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
        const w = result.type == "unicodeEmote" ? 72 : 128;
        image.resize(w,AUTO);
        rs(ImageFrame.createFromJIMP(image));
    })
    ));
    return {
        frames: await Promise.all(frames),
        ogGif
    };
    
};