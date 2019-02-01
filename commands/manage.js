module.exports = {
    exec: async function (msg, args) {
        const [action, command] = args.split(" ");
        if (action && command) {
            switch (action) {
            case "unload":
                const m = await bot.createMessage(msg.channel.id, `Unloading command ${command}`)
                try {
                    cmdWrap.unload(command);
                    await m.edit(`Unloaded the command ${command}`);
                    return;
                } catch (err) {
                    await m.edit(`Cannot unload the command ${command} ${err}`);
                    return;
                }
            case "load":
                const m = await bot.createMessage(msg.channel.id, `Loading ${command == "all" ? "all commands" : `command ${command}`}`);
                if (command == "all") {
                    await cmdWrap.loadAll();
                    await m.edit("Loaded all commands");
                    return;
                } else {
                    try {
                        await cmdWrap.load(command);
                        await m.edit(`Loaded the command ${command}`);
                        return;
                    } catch (err) {
                        await m.edit(`Cannot load the command ${command} ${err}`);
                        return;
                    }
                }
            case "reload":
                const m = await bot.createMessage(msg.channel.id, `Reloading command ${command}`);
                try {
                    await cmdWrap.reload(command);
                    return m.edit(`Reloaded the command ${command}`);
                } catch (err) {
                    return m.edit(`Cannot reload the command ${command} ${err}`);
                }
            default:
                return bot.createMessage(msg.channel.id, "You haven't chosen a valid command management command.");
            }
        } else {
            return bot.createMessage(msg.channel.id, "You haven't chosen a valid command management command or you are missing required arguments.");
        }

    },
    isCmd: true,
    display: true,
    category: 2,
    description: "Command management",
    args: "<reload/load [all]/unload> <command name>"
};