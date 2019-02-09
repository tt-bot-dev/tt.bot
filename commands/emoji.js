module.exports = {
    exec: async function (msg, input) {
        if (!input) {
            msg.channel.createMessage("Input an emoji!");
            return;
        }
        const m = await msg.channel.createMessage(msg.t("IMAGE_GENERATING"));
        const t = process.hrtime();
        let b;
        try {
            b = await bot.workers.sendToRandom(0, "generateImage", {input}).promise;
            if (b && b.err) throw b.err;
        } catch(err) {
            msg.channel.createMessage(msg.t("ERROR", err));
            return;
        }
        if (!b) {
            msg.channel.createMessage(msg.t("IMAGE_NONE"));
            return;
        }
        const hrtime = process.hrtime(t);
        m.delete();
        msg.channel.createMessage({
            embed:{
                description: "Enjoy!",
                color: 0x008800,
                image: {
                    url: `attachment://${b.animated ? "image.gif" : "image.png"}`
                },
                fields: b.generated ? [{
                    name: msg.t("IMAGE_AUTO_GENERATED"),
                    value: msg.t("IMAGE_CAVEATS")
                }] : [],
                footer: {
                    text: msg.t("IMAGE_GENERATION_TIME", ...hrtime)
                }
            }
        }, {
            file: Buffer.from(b.image, "base64"),
            name: b.animated ? "image.gif" : "image.png"
        });
    },
    isCmd: true,
    name: "say",
    display: true,
    category: 1,
    description: "Render up to 5 emojis as a picture.",
    args: "<emoji> [...emoji]"
};