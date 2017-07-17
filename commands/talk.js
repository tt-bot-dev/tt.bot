const s = require("superagent");
module.exports = {
    exec: async function (msg, args) {
        let errMessages = {
            queryTooLong: "Your query is too long.",
            cantTell: "I can't respond on that :thinking:"
        };
        if (args > 255) return msg.channel.createMessage(errMessages.queryTooLong);
        try {
            let r = await s.get("http://api.program-o.com/v2/chatbot/")
                .query({
                    bot_id: 6,
                    say: args,
                    convo_id: msg.author.id,
                    format: "json"
                });
            r.body = JSON.parse(r.text);
            let resp = r.body.botsay.replace(/Program-O/g, bot.user.username).replace(/\<br\/\>/g, "\n");

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