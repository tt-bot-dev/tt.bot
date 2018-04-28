module.exports = {
    exec: async function (msg, args) {
        let splitargs = args.split(" | ");
        let options = {};
        splitargs.forEach(async fe => {
            if (fe.match(/(user:([^]{0,37}))/i)) {
                if (!options.user) {
                    options.user = fe.replace(/user:/, "").replace(/ \\\| /g, " | ");
                }
            } else if (fe.match(/(reason:([^]{0,400}))/i)) {
                if (!options.reason) {
                    options.reason = fe.replace(/reason:/, "").replace(/ \\\| /g, " | ");
                }
            } else {
                console.log(fe + " doesn't match any regexes.");
            }
        });
        
        if (!options.user) return msg.channel.createMessage("You're missing a user to strike.");
        let user;
        try {
            user = await userQuery(options.user, msg, true);
        } catch(err) {
            return;
        }
        try {
            if (user.bot) {
                msg.channel.createMessage(`Bots are not the best subjects to strike. Trust me. :thinking:`)
                return;
            }
            await bot.modLog.addStrike(user.id, msg, options.reason);
            const dm = await user.user.getDMChannel();
            dm.createMessage({
                embed: {
                    title: "It seems like you got striked.",
                    description: `The strike was issued by ${bot.getTag(msg.author)} for reason \`${options.reason || "No reason"}\`.`,
                    footer: {
                        text: "Beware on what you're doing!"
                    },
                    timestamp: new Date()
                }
            });
        } catch(err) {
            msg.channel.createMessage(`Cannot strike the user for this reason: ${err.toString()}`);
        }
    },
    isCmd: true,
    display: true,
    category: 3,
    description: "Strike someone",
    args: "<user:<user>>[ | <reason:<reason>>]",
    aliases: ["warn"]
};