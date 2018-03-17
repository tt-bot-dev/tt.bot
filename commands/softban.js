module.exports = {
    exec: async function (msg, args) {
        if (args) {
            let splitargs = args.split(" | ");
            let options = {};
            splitargs.forEach(async fe => {
                if (fe.match(/(user:([^]{0,37}))/i)) {
                    if (!options.user) {
                        options.user = fe.replace(/user:/, "").replace(/ \\\| /g, " | ");
                    }
                } else if (fe.match(/(reason:([^]{0,400}))/i)) {
                    if (!options.reason) {
                        options.reason = fe.replace(/reason:/, "").replace(/ \\\| /g, " | ");
                    }
                } else {
                    console.log(fe + " doesn't match any regexes.");
                }
            });
            try {
                if (!options.user) {
                    msg.channel.createMessage("You need to specify an user!");
                    return;
                }
                let user = await userQuery(options.user, msg, true);
                if (bot.passesRoleHierarchy(msg.member, user)) {
                    await user.ban(1, `${bot.getTag(msg.author)}: ${options.reason || "no reason"}`);
                    await user.unban();
                    bot.modLog.addBan(user.id, msg, options.reason, true);
                    await msg.channel.createMessage(`:ok_hand: Softbanned ${bot.getTag(user)}`);
                } else {
                    msg.channel.createMessage("You can't softban that user!");
                    return;
                }
            } catch (err) {
                bot.createMessage(msg.channel.id, "```xl\nError:\n" + err + "\n```").then(null, console.error);
                console.error(err);
            }
        } else {
            return await bot.createMessage(msg.channel.id, `**${msg.author.username}**, you miss required arguments. (Who should I softban?)`);
        }
    },
    isCmd: true,
    display: true,
    category: 3,
    description: "Softbans a user.\nThe command uses `\u200b | \u200b` as separators (note the spaces). Use ` \\| ` to escape the separation in your queries.\nThe order of the switches doesn't need to be followed.",
    args: "<user:<user>>[ | <reason:<reason>>]"
};