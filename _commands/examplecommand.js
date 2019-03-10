// This is an example command, it shouldn't be treated as a command
module.exports = {
    exec: function(msg, args) {
        console.log(args);
        bot.createMessage(msg.channel.id, "Hello!");
    },
    isCmd: false,
    display: true,
    category: 1,
    description: "This is an example command."
};