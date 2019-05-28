"use strict";
module.exports = async function (config, msgs, chan) {
    if (!chan.guild.channels.has(config.logChannel)) return;
    try {
        await chan.guild.channels.get(config.logChannel).createMessage({
            embed: {
                title: "Multiple messages deleted",
                fields: [{
                    name: "Messages",
                    value: `${msgs}`,
                    inline:true
                },
                {
                    name: "Channel",
                    value: chan.mention,
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