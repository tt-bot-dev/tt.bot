module.exports = {
    exec: function (msg, args) {
        let things = args.split(" ")
        bot.createMessage(msg.channel.id, `Here you go! <https://discordapp.com/oauth2/authorize?client_id=195506253806436353&scope=bot${isNaN(parseInt(things[0])) == false ? `&permissions=${things[0]}` : ""}${isNaN(parseInt(things[1])) == false ? `&guild_id=${things[1]}` : ""}>\n\nIf you need help using the bot, come to our support server, invite is in info command.`)
    },
    name: "invite",
    isCmd: true,
    category: 1,
    display: true,
    description: "Invite the bot into your server! :)",
    args: "[permission] [guild id]"
}