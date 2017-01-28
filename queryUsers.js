module.exports = function (iQuery, msg) {
    return new Promise((rs, rj) => {
        let users = msg.guild.members.filter(fn => {
            let nick = fn.nick ? fn.nick : fn.username;
            if (fn.username == iQuery || fn.id == iQuery || fn.mention == iQuery || `${fn.username}#${fn.discriminator}` == iQuery || fn.username.startsWith(iQuery)) return true;
            else if (nick.startsWith(iQuery) || nick == iQuery || `${nick}#${fn.discriminator}` == iQuery) return true;
            else if (nick.toLowerCase().startsWith(iQuery) || nick.toLowerCase() == iQuery || `${nick.toLowerCase()}#${fn.discriminator}` == iQuery) return true;
            else if (fn.username.toLowerCase() == iQuery || fn.username.toLowerCase().startsWith(iQuery) || `${fn.username.toLowerCase()}#${fn.discriminator}` == iQuery) return true;
            else return false;
        })
        let binds = {};
        if (users.length == 1) {
            return rs(users[0]);
        } else if (users.length >= 2) {
            let tout = setTimeout(() => {
                bot.removeListener("messageReactionAdd", r); m.delete(); bot.createMessage(msg.channel.id, "Query canceled automatically after inactivity.")
                clearTimeout(tout)
                rj("Canceled automatically.")
            }, 300000)
            let uarr = [];
            function listUsers() {
                let numbers = [":one:", ":two:", ":three:", ":four:", ":five:"];
                let numbersUnicode = ["\u0031\u20E3", "\u0032\u20E3", "\u0033\u20E3", "\u0034\u20E3", "\u0035\u20E3"];
                for (i = 0; i <= 4; i++) {
                    let u = users[i]
                    if (u) {
                        uarr.push(numbers[i] + `    ${u.username}#${u.discriminator}`);
                        binds[numbersUnicode[i]] = {
                            userId: u.id
                        }
                    }
                }
                return uarr.join("\n")
            }
            bot.createMessage(msg.channel.id, {
                embed: {
                    title: "Multiple users found!",
                    description: `I've found ${users.length} users, displaying maximally 5 users.\n${listUsers()}\nElse, use ❌ to cancel.\nQuery will automatically expire in 5 minutes.`
                }
            }).then(m => {
                let numbers = ["\u0031\u20E3", "\u0032\u20E3", "\u0033\u20E3", "\u0034\u20E3", "\u0035\u20E3"];
                for (i = 0; i <= 4; i++) {
                    let u = users[i]
                    if (u)
                        m.addReaction(numbers[i]).then(null, aa => { rj("Cannot add reactions"); bot.createMessage(msg.channel.id, "Can't add reactions here, query canceled."); m.delete(); clearTimeout(tout) })
                }
                m.addReaction("❌")
                function r(me, e, u) {
                    if (u != msg.author.id) return;
                    if (me.id != m.id) return;
                    if (e.name == "❌") { bot.removeListener("messageReactionAdd", r); m.delete(); bot.createMessage(msg.channel.id, "Query canceled."); rj("Cancelled by user"); clearTimeout(tout) }
                    let bindUser = binds[e.name];
                    if (bindUser) {
                        m.delete();
                        clearTimeout(tout)
                        return rs(msg.guild.members.get(bindUser.userId))
                    }
                }
                bot.on("messageReactionAdd", r)

            }).catch(aa => {
                rj("Can't embed or send messages.")
            })
        } else if (users.length == 0) {
            bot.createMessage(msg.channel.id, "No such user!")
            rj("No such user.")
        }
    })

}