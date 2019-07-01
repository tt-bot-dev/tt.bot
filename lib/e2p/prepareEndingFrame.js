"use strict";
const { ImageFrame } = require("jimp-upng");
const Jimp = require("jimp");
const fill = (array, times) => {
    const copy = array.slice();
    for (let i = 0; i <times; i++) copy.forEach(c => array.push(c));
};
module.exports = async (total, height, images, frames) => {
    let f = [];
    images.forEach(f => {
        fill(f, Math.floor(frames / f.length)+1);
    });

    for (let i = 0; i < frames; i++) {
        let pos = 0;
        function getPixl(i) {
            let aPos = pos;
            pos += images[i][0].bitmap.width + 8;
            return aPos;
        }
        const oneLargeImage = new Jimp(total, height);
        let imgMap = images.map(f => {
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