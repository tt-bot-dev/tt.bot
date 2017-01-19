module.exports = {
    exec: function (msg, args) {
        let things = args.split(" ")
        bot.createMessage(msg.channel.id, `Here you go! <https://discordapp.com/oauth2/authorize?client_id=264323176329117697&scope=bot${isNaN(parseInt(things[0])) == false ? `&permissions=${things[0]}` : ""}${isNaN(parseInt(things[1])) == false ? `&guild_id=${things[1]}` : ""}>`)
    },
    name: "invite",
    isCmd: true,
    category: 1,
    display: true,
    description: "Invite the bot into your server! :)",
    args: "[permission] [guild id]"
}