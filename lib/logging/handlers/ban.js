"use strict";
module.exports = async function (config, guild, user, unban) {
    let auditLog;
    try {
        auditLog = await guild.getAuditLogs(50, null, unban ? 23 : 22);
    } catch {}
    const fields = [];
    if (auditLog) {
        const entry = auditLog.entries.find(entry => entry.targetID === user.id);
        fields.push({
            name: `${unban? "Unb" : "B"}anned by`,
            value: `${entry.user.username}#${entry.user.discriminator} (${entry.user.id})`
        });
        if (!unban) fields.push({
            name: "Reason",
            value: entry.reason || "None"
        });
    }
    if (!guild.channels.has(config.logChannel)) return;
    try {
        await guild.channels.get(config.logChannel).createMessage({
            embed: {
                author: {
                    name: `${user.username}#${user.discriminator} (${user.id})`,
                    icon_url: user.avatarURL
                },
                title: `has got ${unban ? "un" : ""}banned`,
                fields,
                color: unban? 0x008800 : 0xFF0000
            }
        });
    } catch {}
};