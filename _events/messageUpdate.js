const logging = require("../lib/logging");
module.exports = async function (msg, old) {
    if (!old) return; // Sorry but we won't do that yet.
    if (!msg.author) return; // Message.author is occasionally undefined. abal plz fix
    if (msg.author.bot) return; // ignore bots
    if (!msg.guild) return;
    const config = await logging.getInfo(msg.guild.id);
    if (msg.content !== old.content) {
        this.emit("messageCreate", msg);
        if (config.logEvents.includes("messageUpdate")) {
            await logging.handlers.update(config, msg, old);
        }
    }
};
module.exports.isEvent = true;