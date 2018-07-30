const UserProfile = require("../Structures/UserProfile");

module.exports = {
    exec: async function (msg, args) {
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
        
        if (!options.user) return msg.channel.createMessage(msg.t("ARGS_MISSING"));
        let user;
        try {
            user = await userQuery(options.user, msg, true);
        } catch(err) {
            return;
        }
        try {
            if (user.bot) {
                msg.channel.createMessage(msg.t("BOTS_NOT_STRIKABLE"));
                return;
            }
            await bot.modLog.addStrike(user.id, msg, options.reason);
            const dm = await user.user.getDMChannel();
            const p = await db.table("profile").get(user.id);
            const prof = p ? new UserProfile(p) : {};
            dm.createMessage({
                embed: {
                    title: i18n.getTranslation("YOU_GOT_STRIKED", prof.locale || "en"),
                    description: i18n.getTranslation("STRIKE_DETAILS", prof.locale || "en", bot.getTag(msg.author), options.reason),
                    footer: {
                        text: i18n.getTranslation("PAY_ATTENTION", prof.locale || "en")
                    },
                    timestamp: new Date()
                }
            });
        } catch(err) {
            msg.channel.createMessage(msg.t("ERROR", err));
        }
    },
    isCmd: true,
    display: true,
    category: 3,
    description: "Strike someone",
    args: "<user:<user>>[ | <reason:<reason>>]",
    aliases: ["warn"]
};