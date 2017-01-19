module.exports = {
    exec: function(msg,args) {
        if (isO(msg)) {
            let evaLUAted
            try {evaLUAted = eval(args)}
            catch(err) {evaLUAted = err.message};
            let overall;
            if (typeof evaLUAted !== "string") {
                overall = require("util").inspect(evaLUAted)
            } else overall = evaLUAted
            bot.createMessage(msg.channel.id, {embed: {
                title: "Evaluated!",
                description: overall,
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