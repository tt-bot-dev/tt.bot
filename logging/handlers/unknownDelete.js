module.exports = async function (config, msg) {
    try {
        await bot.createMessage(config.logChannel, {
            embed: {
                title: "Unknown message deleted",
                fields: [{
                    name: "ID",
                    value: msg.id, inline:true
                },
                {
                    name: "Channel",
                    value: msg.channel.mention,
                    inline: true
                }
                ],
                color: 0xFF0000
            }
        });
    } catch(_) {
        return;
    }
};