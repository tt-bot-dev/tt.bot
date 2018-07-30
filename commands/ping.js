module.exports = {
    exec: function(msg) {
        return bot.createMessage(msg.channel.id, ":ping_pong:").then(m =>{
            m.edit({
                content: "",
                embed: {
                    title: msg.t("PONG"),
                    description: msg.t("PING_LATENCY", m.timestamp - msg.timestamp),
                    footer: {
                        text: msg.t("PING_DISCORD_LATENCY", msg.guild.shard.latency)
                    },
                    color: 0x008800
                }
            });
        });
    },
    isCmd: true,
    name: "ping",
    display: true,
    category: 1,
    description: "Check if the bot is working.",
    aliases: [
        "pang",
        "pong",
        "pung",
        "pwng",
        "peng",
        "b1ng",
        "b0ng"
    ]
};