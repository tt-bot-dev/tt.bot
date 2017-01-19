module.exports = {
    exec: function (msg, args) {
        if (args == "") {
            let gencmds = [];
            let ocmds = [];
            function doShit(fe) {
                let cat = cmds[fe].category;
                if (cat && cmds[fe].display) {
                    if (cat == 1) gencmds.push(cmds[fe].name);
                    else if (cat == 2) ocmds.push(cmds[fe].name);
                }
            }


            Object.keys(cmds).forEach(doShit)
            let tosnd = [];
            if (gencmds.length > 0) {
                tosnd.push(`General commands:\n${gencmds.join(", ")}\n`)
            }
            if (isO(msg) && ocmds.length > 0) {
                tosnd.push(`Owner commands:\n${ocmds.join(", ")}`)
            }
            bot.getDMChannel(msg.author.id).then(dm => {
                return bot.createMessage(dm.id, `\`\`\`prolog\n${tosnd.join("\n")}\`\`\`\nYou can also do \`tt.help (command)\` to get additional command help.`)
            })
        } else {
            bot.getDMChannel(msg.author.id).then(dm => {
                if (cmds[args]) {
                    bot.createMessage(dm.id, `Help for **${cmds[args].name}** command:\nArguments: \`${cmds[args].args != null ? cmds[args].args : "None"}\`\nDescription: ${cmds[args].description != null ? cmds[args].description : "None"}`)
                }
            })
        }
    },
    name: "help",
    isCmd: true,
    category: 1,
    display: false,
    description: "Help?",
    args: "[command]"
}