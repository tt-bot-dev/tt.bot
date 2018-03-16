const GifWrap = require("gifwrap");
const Jimp = require("jimp");
const {AUTO} = Jimp;
module.exports = async (result, b) => {
    let frames = [];
    let ogGif;
    if (Buffer.isBuffer(b)) {
        const c = new GifWrap.GifCodec();
        const gif = await c.decodeGif(b);
        frames = gif.frames;
        ogGif = gif;
    } else if (b instanceof GifWrap.GifFrame) {
        frames = [b];
    } else throw new Error("The buffer must be a GifFrame or a Buffer");
    frames.map(g => new Promise((rs, rj) =>{
        const image = new Jimp(g.bitmap.width, g.bitmap.height, (e, image) => {
            if (e) rj(e);
            let bImg = new GifWrap.BitmapImage(g)
            image.bitmap = bImg.bitmap;
            let w = result.type == "unicodeEmote" ? 72 : 128;
            image.resize(w,AUTO);
            rs(new GifWrap.GifFrame(bImg));
        });
    }));
    return {
        frames: await Promise.all(frames),
        ogGif
    };
    
}