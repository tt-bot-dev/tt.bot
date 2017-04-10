module.exports = {
    exec: async function (msg, args) {
        if (args == "") {
            let gencmds = [];
            let ocmds = [];
            let modcmds = []
            function doShit(fe) {
                let cat = cmds[fe].category;
                if (cat && cmds[fe].display) {
                    if (cat == 1) gencmds.push(fe);
                    else if (cat == 2) ocmds.push(fe);
                    else if (cat == 3) modcmds.push(fe)
                }
            }


            Object.keys(cmds).forEach(doShit)
            let tosnd = [];
            if (gencmds.length > 0) {
                tosnd.push({
                    name: "General commands",
                    value: gencmds.join(", ")
                })
            }
            if (await bot.isModerator(msg.member) && modcmds.length > 0) {
                tosnd.push({
                    name: "Moderator commands",
                    value: modcmds.join(", ")
                })
            }
            if (isO(msg) && ocmds.length > 0) {
                tosnd.push({
                    name: "Owner commands",
                    value: ocmds.join(", ")
                })
            }

            bot.getDMChannel(msg.author.id).then(dm => {
                msg.channel.createMessage(msg.author.mention + " Sent you a PM with help.")
                return bot.createMessage(dm.id, {
                    embed: {
                        author: {
                            name: "Help"
                        },
                        description: "Here, have a list of commands.",
                        fields: tosnd.length > 0 ? tosnd : [{
                            name: "There are no commands.",
                            value: "Sorry for that."
                        }],
                        color: 0x008800,
                        footer: {
                            text: `You can do ${config.prefix}help <command> to get additional command help. | Powered by tt.bot`
                        }
                    }
                })
            })
        } else {
            bot.getDMChannel(msg.author.id).then(dm => {
                if (cmds[args]) {
                    msg.channel.createMessage(`${msg.author.mention} Sent you a PM with help for ${args} command`)
                    bot.createMessage(dm.id, {
                        embed: {
                            author: {name:`Help for ${args}`},
                            fields: [{
                                name: "Arguments",
                                value: cmds[args].args || "None"
                            }, {
                                name: "Description",
                                value: cmds[args].description || "None"
                            }],
                            color: 0x008800
                        }
                    })
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