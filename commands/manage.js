module.exports = {
    exec: function (msg, args) {
        if (isO(msg)) {
            let c = args.split(" ");
            let action = c[0];
            let cmdToRld = c.slice(1);
            if (action && cmdToRld) {
                switch (action) {
                    case "unload":
                        return bot.createMessage(msg.channel.id, `Unloading command ${cmdToRld}`).then(m => {
                            try {
                                cmdWrap.unload(cmdToRld)
                                return m.edit(`Unloaded the command ${cmdToRld}`)
                            } catch (err) {
                                return m.edit(`Cannot unload the command ${cmdToRld} ${err}`)
                            }
                        })
                        break;
                    case "load":
                        return bot.createMessage(msg.channel.id, `Loading ${cmdToRld == "all" ? "all commands" : `command ${cmdToRld}`}`).then(m => {
                                if (cmdToRld == "all") {
                                    cmdWrap.loadAll();
                                    return m.edit("Loaded all commands")
                                } else {
                                    try {
                                        cmdWrap.load(cmdToRld)
                                        return m.edit(`Loaded the command ${cmdToRld}`)
                                    } catch (err) {
                                        return m.edit(`Cannot load the command ${cmdToRld} ${err}`)
                                    }
                                }

                            })
                        break;
                    case "reload":
                        return bot.createMessage(msg.channel.id, `Reloading command ${cmdToRld}`).then(m => {
                            try {
                                cmdWrap.reload(cmdToRld)
                                return m.edit(`Reloaded the command ${cmdToRld}`)
                            } catch (err) {
                                return m.edit(`Cannot reload the command ${cmdToRld} ${err}`)
                            }
                        })
                        break;
                    default:
                        return bot.createMessage(msg.channel.id, "You haven't chosen a valid command management command.")
                        break;
                }
            } else {
                return bot.createMessage(msg.channel.id, "You haven't chosen a valid command management command or you are missing required arguments.")
            }
        }
    },
    isCmd: true,
    display: true,
    category: 2,
    description: "Command management",
    args: "<reload/load [all]/unload> <command name>"
}