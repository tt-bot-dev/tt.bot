module.exports = {
    exec: function(msg) {
        return bot.createMessage(msg.channel.id, "Pinging.......").then(m =>{
            m.edit(`It took ${m.timestamp - (msg.editedTimestamp || msg.timestamp)}ms to ping.\n\nDiscord latency: ${msg.guild.shard.latency}ms`);
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