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
        if (!data && user) return msg.channel.createMessage("That user doesn't have a profile.");
        let profile = data ? new UserProfile(data) : msg.userProfile;
        if (!profile.timezone) return msg.channel.createMessage("That user doesn't have a timezone set.");
        return msg.channel.createMessage(`It's ${moment(new Date()).tz(profile.timezone).format(config.tzDateFormat)} for ${user ? bot.getTag(user) : bot.getTag(msg.author)}.`);
    },
    isCmd: true,
    display: true,
    category: 1,
    description: "Shows the date and time for the user.",
    aliases: ["tf", "time"],
    args: "[user]"
};