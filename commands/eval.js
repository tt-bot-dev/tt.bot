module.exports = {
    exec: async function (msg,args) {
        if (isO(msg)) {
            let evaLUAted
            try {evaLUAted = await eval(`(async () => {${args}})()`)}
            catch(err) {evaLUAted = err.message; console.error(err.stack)}
            let overall;
            if (typeof evaLUAted !== "string") {
                overall = require("util").inspect(evaLUAted)
            } else overall = evaLUAted
            bot.createMessage(msg.channel.id, {embed: {
                title: "Evaluated!",
                description: overall.replace(new RegExp(bot.token, "g"), "jako rilý?"),
                color: 0x008800
            }})
        }
    },
    category: 2,
    isCmd:true,
    description: "evaluates js. if ur not an owner go away",
    display:true,
    name:"eval",
    args: "<code>"
}