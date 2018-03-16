module.exports = {
    exec: async function (msg, input) {
        if (!input) {
            msg.channel.createMessage("Input an emoji!");
            return;
        }
        const m = await msg.channel.createMessage("We're generating the image. Wait and prepare a cup of coffee. This may take a while.");
        let b;
        try {
            b = await bot.workers.sendToRandom(0, "generateImage", {input});
        } catch(err) {
            msg.channel.createMessage(`Oops! I can't generate the image! Give my owner these error information\n\`\`\`\n${err.toString()}\n\`\`\``);
            return;
        }
        if (!b) {
            msg.channel.createMessage("Could not get an image. Please validate your input and retry again.");
            return;
        }
        m.delete();
        msg.channel.createMessage({
            embed:{
                description: "Enjoy!",
                color: 0x008800,
                image: {
                    url: `attachment://${b.animated ? "image.gif" : "image.png"}`
                },
                fields: b.generated ? [{
                    name: "This image is automatically generated.",
                    value: "Nobody and also nothing isn't perfect, these are current caveats that you may experience and we know about.\n- Your emoji may be fast/slow depending on the frame rate (we use 20ms delay/50fps)\n- Your emoji may get cut off."
                }] : []
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
    description: "Make emoji render as a picture. Has a limit of 5 emotes.",
    args: "<emoji> [...emoji]"
};