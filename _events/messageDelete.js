const logging = require("../lib/logging");
module.exports = async function (msg) {
    if (!msg.channel.guild) return;
    if (!msg.author) {
        const config = await logging.getInfo(msg.channel.guild.id);
        if (config.logEvents.includes("messageUnknownDelete")) {
            await logging.handlers.unknownDelete(config, msg);
        }
        return;
    } // Message.author is occasionally undefined. abal plz fix
    if (msg.author.bot) return; // ignore bots
    const config = await logging.getInfo(msg.channel.guild.id);
    if (config.logEvents.includes("messageDelete")) {
        await logging.handlers.delete(config, msg);
    }
};
module.exports.isEvent = true;