module.exports = {
    exec: async function (msg, args) {
        if (!args) {
            msg.channel.createMessage("Input an emoji!")
            return;
        }
        await msg.channel.sendTyping()
        const e2p = rld("./emojitopic")
        let b = await e2p(args);
        if (!b) {
            msg.channel.createMessage("Could not get an image. Please validate your input and retry again.")
            return;
        }
        msg.channel.createMessage("Enjoy! :^)", {
            file: b,
            name: "image.png"
        })
    },
    isCmd: true,
    name: "say",
    display: true,
    category: 2,
    description: "Make emoji render as a picture. Has a limit of 5 emotes."
};