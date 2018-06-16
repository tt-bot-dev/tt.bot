const logging = require("../logging");
module.exports = async function (guild, user) {
    const config = await logging.getInfo(guild.id);
    if (config.logEvents.includes("guildBan")) {
        await logging.handlers.ban(config, guild, user, false);
    }
};
module.exports.isEvent = true;