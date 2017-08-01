const doit = async (arg = "") => {
    let spl = arg.split(" ")
    if (spl.length > 5) spl = spl.slice(0, 5)
    let getemot = (arg) => new Promise(rs => {
        const EmojiRegex = /<:.*?:(.*?)>/
        const EmojiText = /:.*?:/
        const EmojiSkinToneText = /:(.*?)::skin-tone-([1-5]):/
        const EmojiTextSkinTone = /:(.*?):(🏻|🏼|🏽|🏾|🏿)/
        if (arg) {
            let m = arg.match(EmojiRegex)
            if (m && m.length > 0) {
                rs({ type: "discordCustomEmoji", url: `https://cdn.discordapp.com/emojis/${m[1]}.png` })
            } else {
                let e = function (uS, sep) {
                    if (!uS) return;
                    var r = [], c = 0, p = 0, i = 0;
                    while (i < uS.length) {
                        c = uS.charCodeAt(i++);
                        if (p) {
                            r.push((0x10000 + ((p - 0xD800) << 10) + (c - 0xDC00)).toString(16));
                            p = 0;
                        } else if (0xD800 <= c && c <= 0xDBFF) {
                            p = c;
                        } else {
                            r.push(c.toString(16));
                        }
                    }
                    return r.join(sep || '-');
                }
                let m = arg.match(EmojiText)
                if (m && m.length > 0) {
                    const { get } = require("https")
                    get("https://cdn.rawgit.com/omnidan/node-emoji/master/lib/emoji.json", r => {
                        let buffers = [];
                        r.on("data", c => buffers.push(c))
                        r.once("end", () => {
                            let b = Buffer.concat(buffers);
                            let st = arg.match(EmojiSkinToneText);
                            let esk = arg.match(EmojiTextSkinTone);
                            let parse
                            try {
                                parse = JSON.parse(b.toString());
                            } catch (err) {
                                return;
                            }

                            let stripOut
                            if (st && st.length > 0) stripOut = function () {
                                let e = st[1];
                                let skt = (parseInt(st[2]) + 1);
                                if (!parse[e] || parse[`skin-tone-${skt}`]) return;
                                return `${parse[e]}${parse[`skin-tone-${skt}`]}`;
                            }; else if (esk && esk.length > 0) stripOut = function () {
                                if (!parse[esk[1]]) return;
                                else return `${parse[esk[1]][esk[2]]}`
                            };
                            else stripOut = function () { return parse[arg.replace(/:/g, "")]; }
                            rs({ type: "unicodeEmote", url: `https://twemoji.maxcdn.com/2/72x72/${e(stripOut())}.png` })
                        })
                    })
                } else rs({ type: "unicodeEmote", url: `https://twemoji.maxcdn.com/2/72x72/${e(arg)}.png` })
            }
        }
    })
    let result = await Promise.all(spl.map(getemot))
    const Jimp = require("jimp");
    const { read, AUTO, MIME_PNG } = Jimp;
    let imgs = await Promise.all(result.map(r => Jimp.read(r.url)))
    let total = 0;
    for (let i = 0; i < imgs.length; i++) {
        let img = imgs[i];
        img.resize(result[i].type == "unicodeEmote" ? 72 : 128, AUTO)
    }
    let height = imgs.slice().sort((a, b) => b.bitmap.height - a.bitmap.height)[0].bitmap.height
    for (let i = 0; i < imgs.length; i++) {
        if (i == 0) total += imgs[i].bitmap.width
        else total += (imgs[i].bitmap.width + 8)
    }
    let bigImage = await (new Promise((rs, rj) => new Jimp(total, height, (err, image) => {
        if (err) rj(err);
        else rs(image)
    })))
    let pos = 0
    function getPixl(i) {
        let aPos = pos;
        pos = pos + imgs[i].bitmap.width + 8
        return aPos
    }
    for (let i = 0; i < imgs.length; i++) {
        let item = imgs[i];
        bigImage.composite(item,
            //(i == (imgs.length - 1) ? i * 72 : getPixl(i))
            getPixl(i)
            , 0)
    }
    return await (new Promise((rs, rj) => bigImage.getBuffer(MIME_PNG, (e, img) => {
        if (e) rj(e)
        else rs(img)
    })))
}
module.exports = doit