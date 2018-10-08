const s = require("snekfetch");
module.exports = {
    exec: async function (msg, args) {
        const errMessages = {
            queryTooLong: msg.t("QUERY_TOO_LONG"),
            cantTell: msg.t("CANT_TELL")
        };
        if (args > 255) return msg.channel.createMessage(errMessages.queryTooLong);
        try {
            const r = await s.get("http://api.program-o.com/v2/chatbot/")
                .query({
                    bot_id: 6,
                    say: args,
                    convo_id: msg.author.id,
                    format: "json"
                });
            const body = JSON.parse(r.raw.toString());
            const resp = body.botsay.replace(/Program-O/g, bot.user.username).replace(/\<br\/\>/g, "\n");

            await msg.channel.createMessage(resp);
        } catch (err) {
            msg.channel.createMessage(errMessages.cantTell);
            console.error(err);
        }
    },
    isCmd: true,
    display: true,
    category: 1,
    description: "Chat with the cleverbot!",
    args: "<query>",
    aliases: [
        "cb"
    ]
};