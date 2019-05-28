"use strict";
module.exports = async function (config, msg) {
    if (!msg.guild.channels.has(config.logChannel)) return;
    try {
        await msg.guild.channels.get(config.logChannel).createMessage({
            embed: {
                author: {
                    name: `${bot.getTag(msg.author)} (${msg.author.id})`,
                    icon_url: msg.author.avatarURL
                },
                title: "Message deleted",
                fields: [{
                    name: "ID",
                    value: msg.id,
                    inline: true
                },
                {
                    name: "Channel",
                    value: msg.channel.mention,
                    inline: true
                },

                {
                    name: "Old content",
                    value: msg.content.replace(/\[/g, "\\[").replace(/\]/g, "\\]").replace(/\(/g, "\\(").replace(/\)/g, "\\)")
                }
                ],
                color: 0xFF0000
            }
        });
    } catch (_) {
        return;
    }
};