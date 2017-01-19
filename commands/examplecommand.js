module.exports = {
    exec: function(msg,args) {
        return bot.createMessage(msg.channel.id, "Hello!")
    },
    isCmd: true,
    name: "examplecommand",
    display: true,
    category: 1,
    description: "Testing command."
}