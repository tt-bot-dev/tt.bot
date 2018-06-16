module.exports = {
    exec: async function (msg, args) {
        let user;
        try {
            user = await userQuery(args || msg.author.id, msg, true);
        } catch(err) {
            return;
        }
        if (user.bot) {
            msg.channel.createMessage("Sorry, bots cannot be striked. Therefore, I can't display them.");
            return;
        }
        try {
            const strikes = await bot.modLog.getUserStrikes(user.id, msg);
            if (strikes > 25) {
                let strikeStr = strikes.map(s => `${s.id} - ${s.reason}`);
                msg.channel.createMessage("You have too much strikes for me to display in an embed. Here's a text file instead:", {
                    file: Buffer.from(strikeStr.join("\r\n")),
                    name: "strikes.txt"
                });
                return;
            }
            msg.channel.createMessage({
                embed: {
                    author: {
                        name: `Here are ${bot.getTag(user)}'s strikes`
                    },
                    fields: strikes.map(s => ({
                        name: `ID: ${s.id}`,
                        value: s.reason
                    }))
                }
            });
        } catch(err) {
            msg.channel.createMessage(`Cannot get user's strikes for this reason: ${err.toString()}`);
        }
    },
    isCmd: true,
    display: true,
    category: 1,
    description: "Get user's strikes.",
    args: "[user]",
};