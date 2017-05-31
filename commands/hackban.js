module.exports = {
    exec: async function (msg, args) {
        if (args) {
            if (await bot.isModerator(msg.member)) {
                let userToBan
                try {
                    userToBan = await bot.getUserWithoutRESTMode(args)
                }catch(err) {
                    return msg.channel.createMessage("That user doesn't exist!")
                }
                try {
                    await msg.guild.banMember(userToBan.id, 0, `Hackbanned by ${bot.getTag(msg.author)}`)
                    return msg.channel.createMessage(":ok_hand:")
                }catch(err) {
                    return msg.channel.createMessage("Can't ban the user, do I lack the permission to?")
                }
            }
        } else {
            return await bot.createMessage(msg.channel.id, `**${msg.author.username}**, you miss required arguments.`)
        }
    },
    isCmd: true,
    name: "ban",
    display: true,
    category: 3,
    description: "Bans a user by ID.",
    args: "<user id>"
}