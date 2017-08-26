module.exports = {
    exec: async function (msg, args) {
        if (!args && msg.attachments.filter(i => i.height && i.width).length == 0) {
            msg.channel.createMessage("Please give us an image.");
            return
        }
        const URLRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/
        const ImageExtensionRegex = /(\.png|\.jpg|\.bmp)$/i
        const url = (function getURL() {
            if (msg.attachments.filter(i => i.height && i.width).length > 0 && msg.attachments.filter(i => i.height && i.width)[0].url.match(ImageExtensionRegex)) {
                return msg.attachments.filter(i => i.height && i.width)[0].url
            } else if (args && args.match(URLRegex) && args.match(ImageExtensionRegex)) {
                return args
            } else {
                return
            }
        })()
        if (!url) return "Seems to be an invalid URL :eyes:"
        else {
            await msg.channel.sendTyping();
            const { read, MIME_JPEG } = require("jimp")
            let image;
            try {
                image = await read(url)
            } catch (err) {
                return "There was an error reading the image."
            }
            image.quality((Math.random() * 5) + 1)
            let file
            try {
                file = await (new Promise((rs, rj) => {
                    image.getBuffer(MIME_JPEG, (e, b) => {
                        if (e) rj(e);
                        else rs(b);
                    })
                }))
            } catch (err) {
                return "There was an error generating the image."
            }
            msg.channel.createMessage("", {file, name: "needsmorejpeg.jpg"})

        }
    },
    isCmd: true,
    name: "say",
    display: true,
    category: 2,
    description: "Does your thing need more JPEG? :eyes: Give it to us and we'll handle it for you!",
    aliases: [
        "jpeg",
        "jpg",
        "needmorejpeg",
        "needmorejpg",
        "needmorejpeg"
    ],
    args: "<image or attachment>"
};