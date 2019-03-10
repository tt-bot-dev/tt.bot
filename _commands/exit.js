module.exports = {
    exec: async function (msg) {
        console.log(`${__filename}      | ${bot.tag(msg.author)} made me stop.`);
        await msg.channel.createMessage(":wave:");
        process.exit(0);
    },
    isCmd: true,
    category: 2,
    display: true,
    description: "Shuts down the bot."
};