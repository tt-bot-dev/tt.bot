module.exports = async function (config, guild, user, unban) {
    let a;
    try {
        a = await guild.getAuditLogs(50, null, unban ? 23 : 22);
    }
    catch (err) {
        console.error(err);
        a = null;
    }
    const fields = [];
    if (a) {
        const entry = a.entries.find(a => a.targetID == user.id);
        fields.push({
            name: `${unban? "Unb" : "B"}anned by`,
            value: `${bot.getTag(entry.user)} (${entry.user.id})`
        });
        if (!unban) fields.push({
            name: "Reason",
            value: entry.reason || "None"
        });
    }
    try {
        await bot.createMessage(config.logChannel, {
            embed: {
                author: {
                    name: `${bot.getTag(user)} (${user.id})`,
                    icon_url: user.avatarURL
                },
                title: `has got ${unban ? "un" : ""}banned`,
                fields,
                color: unban? 0x008800 : 0xFF0000
            }
        });
    } catch(_) {
        console.error(_);
        return;
    }
};