const logging = require("../logging");
module.exports = async function (msg) {
    if (!msg[0].channel.guild) return; // All bulkdeleted messages are from a guild
    const channel = msg[0].channel;
    const config = await logging.getInfo(channel.guild.id);
    if (config.logEvents.includes("messageBulkDelete")) {
        await logging.handlers.bulkDelete(config, msg.length, channel);
    }
};
module.exports.isEvent = true;