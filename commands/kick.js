module.exports = {
    exec: async function (msg, args) {
        if (args) {
            let splitargs = args.split(" | ");
            let options = {};
            splitargs.forEach(async fe => {
                if (fe.match(/(user:([^]{0,36}))/i)) {
                    if (!options.user) {
                        options.user = fe.replace(/user:/, "").replace(/ \\\| /g, " | ");
                    }
                } else if (fe.match(/(reason:([^]{0,400}))/i)) {
                    if (!options.reason) {
                        options.reason = fe.replace(/reason:/, "").replace(/ \\\| /g, " | ");
                    }
                } else {
                    msg.channel.createMessage(msg.t("INVALID_ARG", `\`${fe}\``));
                }
            });
            try {
                
                if (!options.user) {
                    msg.channel.createMessage(msg.t("ARGS_MISSING"));
                    return;
                }
                let user = await userQuery(options.user, msg, true);
                if (bot.passesRoleHierarchy(msg.member, user)) {
                    await user.kick(`${bot.getTag(msg.author)}: ${options.reason || "no reason"}`);
                    bot.modLog.addKick(user.id, msg, options.reason);
                    await msg.channel.createMessage(msg.t("KICK_DONE", user));
                } else {
                    msg.channel.createMessage(msg.t("ROLE_HIERARCHY_ERROR"));
                }
            } catch (err) {
                bot.createMessage(msg.channel.id, msg.t("ERROR", err)).then(null, console.error);
                console.error(err);
            }

        } else {
            return await bot.createMessage(msg.channel.id, msg.t("ARGS_MISSING"));
        }
    },
    isCmd: true,
    display: true,
    category: 3,
    description: "Kicks an user.\nThe command uses `\u200b | \u200b` as separators (note the spaces). Use ` \\| ` to escape the separation in your queries.\nThe order of the switches doesn't matter.",
    args: "<user:<user>>[ | <reason:<reason>>]"
};