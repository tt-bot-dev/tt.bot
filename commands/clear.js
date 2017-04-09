module.exports = {
    exec: async function (msg, args) {
        if (args) {
            if (await bot.isModerator(msg.member)) {
                let splitargs = args.split(" | ")
                let options = {}
                splitargs.forEach(async fe => {
                    if (fe.match(/(messages:(1000|([0-9]{1,3})))/i)) {
                        if (!options.messages) {
                            options.messages = parseInt(fe.replace(/messages:/, ""))
                        }
                    } else if (fe.match(/(contains:([^]{0,500}))/i)) {
                        if (!options.contains) {
                            options.contains = fe.replace(/contains:/, "").replace(" \\| ", " | ");
                        }
                    } else if (fe.match(/(mentions:([^]{0,37}))/i)) {
                        if (!options.mentions) {
                            try {
                                options.mentions = await userQuery(fe.replace(/mentions:/, "").replace(" \\| ", " | "), msg)

                            } catch (err) {
                                options.mentions = null;
                            }
                        }
                    } else if (fe.match(/(from:([^]{0,37}))/i)) {
                        if (!options.from) {
                            try {
                                options.from = await userQuery(fe.replace(/from:/, "").replace(" \\| ", " | "), msg)
                            } catch (err) {
                                options.from = null
                            }
                        }
                    } else {
                        console.log(fe + " doesn't match any regexes.")
                    }
                })
                var oldestSnowflakeAllowed = (Date.now() - 1421280000000) * 4194304;
                let msgCount = () => { if (options.messages) { if (isNaN(options.messages)) return 100; else return options.messages; } else return 100 }
                let mss = await msg.channel.getMessages(msgCount())
                function matchesCriteriaContaining(m) {
                    if (!options.contains) return true;
                    if (options.contains && m.content.includes(options.contains)) return true;
                    else return false;
                }
                function matchesCriteriaMentions(m) {
                    if (!options.mentions) return true;
                    if (options.mentions && m.mentions.map(u => u.id).includes(options.mentions.id)) return true;
                    else return false;
                }
                function matchesCriteriaFrom(m) {
                    if (!options.from) return true;
                    if (options.from && m.author.id == options.from.id) return true;
                    else return false;
                }
                let callAll = m => (matchesCriteriaContaining(m) && matchesCriteriaFrom(m) && matchesCriteriaMentions(m))
                let msgs = mss.filter(callAll);
                let msgIDs = msgs.map(m => m.id);
                let filteredMsgIDs = msgIDs.filter(fn => {
                    if (fn < oldestSnowflakeAllowed) return false;
                    else return true;
                })
                try {
                    await msg.delete()
                    await msg.channel.deleteMessages(filteredMsgIDs);
                    let msgOK = await msg.channel.createMessage(`:ok_hand: Deleted ${filteredMsgIDs.length} messages.`);
                    setTimeout(async () => await msgOK.delete(), 2000);
                } catch (err) {
                    await msg.channel.createMessage("I don't have perms to delete messages, or some are old.")
                    return console.error(err)
                }
            }
        } else {
            return await bot.createMessage(msg.channel.id, `**${msg.author.username}**, you miss required arguments.`)
        }
    },
    isCmd: true,
    display: true,
    category: 3,
    description: "Clears desired number of messages.\nThe command uses ` | ` as separators. Use ` \\| ` to escape the separation in your queries.\nPlease note the command clears messages from any switches it is used on.",
    args: "<messages:<number|100>> | [from:<user>] | [mentions:user] | [contains:<query>]"
}