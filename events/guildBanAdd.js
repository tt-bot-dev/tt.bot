const logging = require("../lib/logging");
module.exports = async function (guild, user) {
    const config = await logging.getInfo(guild.id);
    if (config.logEvents.includes("guildBan")) {
        await logging.handlers.ban(config, guild, user, false);
    }
    const guildData = await db.table("configs").get(guild.id);
    if (guildData) {
        let m;
        try {
            m = await guild.getAuditLogs(50, null, 22);
        } catch(_) {
            // Eslint pls
        }
        let entry;
        if (m) entry = m.entries.find(a => a.targetID == user.id);
        // Don't log bans coming from us
        if (entry && entry.user.id !== this.user.id) this.modLog.addBan(user.id, {
            guildConfig: guildData,
            author: entry ? entry.user : {
                username: "Unknown User",
                discriminator: "0000",
                avatarURL: "https://cdn.discordapp.com/embed/avatars/0.png",
                id: "Unknown"
            },
            guild
        }, entry ? entry.reason : null);
    }
};
module.exports.isEvent = true;