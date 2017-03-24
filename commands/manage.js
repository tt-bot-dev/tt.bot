module.exports = {
    exec: function (msg, args) {
        if (isO(msg)) {
            let c = args.split(" ");
            let action = c[0];
            switch (action) {
                case "unload":
                    return bot.createMessage(msg.channel.id, `Unloading command ${c[1]}`).then(m => {
                        try {
                            cmdWrap.unload(c[1])
                            return m.edit(`Unloaded the command ${c[1]}`)
                        } catch (err) {
                            return m.edit(`Cannot unload the command ${c[1]} ${err}`)
                        }
                    })
                    break;
                case "load":
                    return bot.createMessage(msg.channel.id, `Loading command ${c[1]}`).then(m => {
                        try {
                            if (c[1] == "all") cmdWrap.loadAll(); else cmdWrap.load(c[1])
                            return m.edit(`Loaded the command ${c[1]}`)
                        } catch (err) {
                            return m.edit(`Cannot load the command ${c[1]} ${err}`)
                        }
                    })
                    break;
                case "reload":
                    return bot.createMessage(msg.channel.id, `Reloading command ${c[1]}`).then(m => {
                        try {
                            cmdWrap.reload(c[1])
                            return m.edit(`Reloaded the command ${c[1]}`)
                        } catch (err) {
                            return m.edit(`Cannot reload the command ${c[1]} ${err}`)
                        }
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
    description: "Say something.",
    args: "[]"
}