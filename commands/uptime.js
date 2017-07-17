module.exports = {
    exec: async function (msg) {
        msg.channel.createMessage(`I've been up for **${getUptime(moment(), moment(Date.now() - bot.uptime))}**.`);
    },
    isCmd: true,
    display: true,
    category: 1,
    description: "Shows for how long is the bot up.",
};