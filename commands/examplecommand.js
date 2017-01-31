// This is an example command, it shouldn't be treat as a command
module.exports = {
    exec: function(msg,args) {
        return bot.createMessage(msg.channel.id, "Hello!")
    },
    isCmd: false,
    name: "examplecommand",
    display: true,
    category: 1,
    description: "Testing command."
}