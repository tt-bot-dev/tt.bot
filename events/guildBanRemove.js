const logging = require("../lib/logging");
module.exports = async function (guild, user) {
    const config = await logging.getInfo(guild.id);
    if (config.logEvents.includes("guildUnban")) {
        await logging.handlers.ban(config, guild, user, true);
    }
};
module.exports.isEvent = true;