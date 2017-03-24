module.exports = {
    exec: function (msg, args) {
        if (isO(msg)) {
            let c = args.split(" ");
            let action = c[0];
            switch (action) {
                case "unload":
                    bot.createMessage(msg.channel.id, `Unloading command ${c[1]}`).then(m =>{
                        cmdWrap.unload
                    })
                    break;
                default:
                    return bot.createMessage(msg.channel.id, "You haven't chosen a valid command management command.")
                    break;
            }
        }
    },
    isCmd: true,
    display: true,
    category: 2,
    description: "Say something."
}