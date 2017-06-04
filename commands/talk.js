const s = require("superagent")
module.exports = {
    exec: async function (msg, args) {
        let errMessages = {
            queryTooLong: "Your query is too long.",
            cantTell: "I can't respond on that :thinking:"
        }
        if (args > 255) return msg.channel.createMessage(errMessages.queryTooLong)
        try {
            let r = await s.get(`http://api.program-o.com/v2/chatbot/?bot_id=6&say=${encodeURIComponent(args)}&convo_id=${msg.author.id}&format=json`)
            .set("Accept", "application/json")
            .set("User-Agent", "tt.bot (https://github.com/tttie/tttie-bot)")
            msg.channel.createMessage(r.body.botsay.replace(/Program-O/g, bot.user.username).replace(/\<br\/\>/g, "\n"))
        } catch(err) {
            msg.channel.createMessage(errMessages.cantTell)
        }
    },
    isCmd: true,
    display: true,
    category: 1,
    description: "Chat with the cleverbot!",
    args: "<query>"
}