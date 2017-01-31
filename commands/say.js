module.exports = {
    exec: function (msg, args) {
        if (isO(msg)) {
            let c = args.split(" ");
            let cToSend = c[0];
            let mToSend = c.slice(1).join(" ");
            bot.createMessage(cToSend, "\u200b"+mToSend + `\n-${msg.author.username}#${msg.author.discriminator}`).then(m => {
                bot.createMessage(msg.channel.id, "Sucessfully sent.")
            }).catch(err =>{
                bot.createMessage(msg.channel.id, `Can't send the message, error ${err}`);
            })
        }
    },
    isCmd: true,
    name: "say",
    display: true,
    category: 1,
    description: "Say something."
}