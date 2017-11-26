module.exports = {
    exec: async function (msg, args) {
        if (args) {
            let splitargs = args.split(" | ");
            let options = {};
            splitargs.forEach(async fe => {
                if (fe.match(/(messages:(1000|([0-9]{1,3})))/i)) {
                    if (!options.messages) {
                        options.messages = parseInt(fe.replace(/messages:/, ""));
                    }
                } else if (fe.match(/(contains:([^]{0,500}))/i)) {
                    if (!options.contains) {
                        options.contains = fe.replace(/contains:/, "").replace(/ \\\| /g, " | ");
                    }
                } else if (fe.match(/(mentions:([^]{0,37}))/i)) {
                    if (!options.mentions) {
                        try {
                            options.mentions = fe.replace(/mentions:/, "").replace(/ \\| /g, " | ");

                        } catch (err) {
                            options.mentions = null;
                        }
                    }
                } else if (fe.match(/(from:([^]{0,37}))/i)) {
                    if (!options.from) {
                        if (fe.replace(/from:/, "").replace(/ \\| /g, " | ") == "bots") return options.from = "bots";
                        try {
                            options.from = fe.replace(/from:/, "").replace(/ \\\| /g, " | ");
                        } catch (err) {
                            options.from = null;
                        }
                    }
                } else if (fe.match(/(invert:)(true|false)/i)) {
                    let invertion = fe.replace(/invert:/, "");
                    if (invertion == "true") options.invert = true; else options.invert = false;
                } else {
                    console.log(fe + " doesn't match any regexes.");
                }
            });

            try {
                await msg.delete();
                if (options.from && options.from != "bots") options.from = await userQuery(options.from, msg);
                if (options.mentions) options.mentions = await userQuery(options.mentions, msg);
                var oldestSnowflakeAllowed = (Date.now() - 1421280000000) * 4194304;
                let msgCount = () => { if (options.messages) { if (isNaN(options.messages)) return 100; else return options.messages; } else return 100; };
                let mss = await msg.channel.getMessages(msgCount());
                function matchesCriteriaContaining(m) {
                    if (!options.contains) return true;
                    if (options.contains && m.content.toLowerCase().includes(options.contains.toLowerCase())) return true;
                    else return false;
                }
                function matchesCriteriaMentions(m) {
                    if (!options.mentions) return true;
                    if (options.mentions && m.mentions.map(u => u.id).includes(options.mentions.id)) return true;
                    else return false;
                }
                function matchesCriteriaFrom(m) {
                    if (!options.from) return true;
                    if (options.from == "bots" && m.author.bot) return true;
                    if (options.from && m.author.id == options.from.id) return true;
                    else return false;
                }
                let callAll = m => options.invert ? !(matchesCriteriaContaining(m) && matchesCriteriaFrom(m) && matchesCriteriaMentions(m)) : (matchesCriteriaContaining(m) && matchesCriteriaFrom(m) && matchesCriteriaMentions(m));
                let msgs = mss.filter(callAll);
                let msgIDs = msgs.map(m => m.id);
                let filteredMsgIDs = msgIDs.filter(fn => {
                    if (fn < oldestSnowflakeAllowed) return false;
                    else return true;
                });
                await msg.channel.deleteMessages(filteredMsgIDs);
                let msgOK = await msg.channel.createMessage(`:ok_hand: Deleted ${filteredMsgIDs.length} messages.`);
                setTimeout(async () => await msgOK.delete(), 2000);
            } catch (err) {
                await msg.channel.createMessage("I don't have perms to delete messages, or some are old.");
                return console.error(err);
            }
        } else {
            return await bot.createMessage(msg.channel.id, `**${msg.author.username}**, you miss required arguments. (What should I clear?)`);
        }
    },
    isCmd: true,
    display: true,
    category: 3,
    description: "Clears desired number of messages.\nThe command uses `\u200b | \u200b` as separators (note the spaces). Use ` \\| ` to escape the separation in your queries.\nThe order of the switches doesn't need to be followed.\n\nSwitch documentation:\nmessages - number of messages to fetch and delete. Defaults to 100.\nfrom - Specifies whose messages should be deleted.\nmentions - specifies messages which mention the specified user\ncontains - The string which is included in the messages, limit of the string is 500 characters.\ninvert - inverts all effects of all specified switches, for example: `from:TTtie#5937 | invert:true` will clear all messages which aren't made by TTtie#5937.",
    args: "any text to clear 100 messages from everyone or [messages:<number|100>] | [from:<user>|bots] | [mentions:<user>] | [contains:<query>] | <invert:true|false>"
};