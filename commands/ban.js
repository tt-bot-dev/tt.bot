module.exports = {
    exec: async function (msg, args) {
        if (args) {
            try {
                let user = await userQuery(args, msg);
                if (bot.passesRoleHierarchy(msg.member, user)) {
                    await user.ban(1, `Banned by ${bot.getTag(msg.author)}`);
                    await msg.channel.createMessage(`:ok_hand: Banned ${bot.getTag(user)}.`);
                } else {
                    msg.channel.createMessage("You can't ban that user.");
                }
            } catch (err) {
                bot.createMessage(msg.channel.id, "```xl\nError:\n" + err + "\n```").then(null, console.error);
                console.error(err);
            }
        } else {
            return await bot.createMessage(msg.channel.id, `**${msg.author.username}**, you miss required arguments.`);
        }
    },
    isCmd: true,
    name: "ban",
    display: true,
    category: 3,
    description: "Bans a user.",
    args: "<user>"
};