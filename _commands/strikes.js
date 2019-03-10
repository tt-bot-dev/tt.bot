module.exports = {
    exec: async function (msg, args) {
        let user;
        try {
            user = await userQuery(args || msg.author.id, msg, true);
        } catch (err) {
            return;
        }
        if (user.bot) {
            msg.channel.createMessage(msg.t("BOTS_NOT_STRIKABLE"));
            return;
        }
        try {
            const strikes = await bot.modLog.getUserStrikes(user.id, msg);
            if (strikes > 25) {
                let strikeStr = strikes.map(s => `${s.id} - ${s.reason}`);
                msg.channel.createMessage(msg.t("TOO_MUCH_STRIKES"), {
                    file: Buffer.from(strikeStr.join("\r\n")),
                    name: "strikes.txt"
                });
                return;
            }
            await msg.channel.createMessage({
                embed: {
                    author: {
                        name: msg.t("STRIKE_OVERVIEW", bot.getTag(user))
                    },
                    fields: strikes.map(s => ({
                        name: `ID: ${s.id}`,
                        value: s.reason
                    }))
                }
            });
        } catch (err) {
            msg.channel.createMessage(msg.t("ERROR", err));
        }
    },
    isCmd: true,
    display: true,
    category: 1,
    description: "Get user's strikes.",
    args: "[user]",
};