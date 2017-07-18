module.exports = {
    exec: async function (msg, args) {
        if (args) {
            if (await bot.isModerator(msg.member)) {
                try {
                    let user = await userQuery(args, msg);
                    if (bot.passesRoleHierarchy(msg.member, user)) {
                        await user.kick(`Kicked by ${bot.getTag(msg.author)}`);
                        await msg.channel.createMessage(`:ok_hand: Kicked ${bot.getTag(user)}.`);
                    } else {
                        msg.channel.createMessage("You can't kick that user!");
                    }
                } catch(err) {
                    bot.createMessage(msg.channel.id, "```xl\nError:\n" + err + "\n```").then(null, console.error);
                    console.error(err);
                }
            }
        } else {
            return await bot.createMessage(msg.channel.id, `**${msg.author.username}**, you miss required arguments. (Who should I kick?)`);
        }
    },
    isCmd: true,
    display: true,
    category: 3,
    description: "Kicks a user.",
    args: "<user>"
};