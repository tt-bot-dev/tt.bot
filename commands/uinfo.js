module.exports = {
    exec: function (msg, args) {
        userQuery(args, msg).then(u => {
            bot.createMessage(msg.channel.id, "Still WIP, mate.")
        }).catch(() => { return })
    },
    isCmd: true,
    name: "uinfo",
    display: true,
    category: 1,
    description: "User information."
}