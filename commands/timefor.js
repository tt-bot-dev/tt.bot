const UserProfile = require("../Structures/UserProfile");
module.exports = {
    exec: async function (msg, args) {
        let user;
        if (args) {
            try {
                user = await userQuery(args, msg, true);
            } catch(e) {
                return;
            }
        }
        let data;
        if (args && user) data = await db.table("profile").get(user.id);
        if (!data && user) return msg.channel.createMessage(msg.t("PROFILE_SPECIFIC_NONEXISTENT", bot.getTag(user)));
        let profile = data ? new UserProfile(data) : msg.userProfile;
        if (!profile.timezone) return msg.channel.createMessage(msg.t("NO_TZ"));
        return msg.channel.createMessage(msg.t("TIME_FOR", moment(new Date()).tz(profile.timezone).format(config.tzDateFormat), data? bot.getTag(user) : bot.getTag(msg.author)));
    },
    isCmd: true,
    display: true,
    category: 1,
    description: "Shows what time is it for a certain user.",
    aliases: ["tf", "time"],
    args: "[user]"
};