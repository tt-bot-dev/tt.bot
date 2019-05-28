"use strict";
module.exports = async function (config, msg) {
    if (!msg.channel.guild.channels.has(config.logChannel)) return;
    try {
        await msg.channel.guild.channels.get(config.logChannel).createMessage({
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