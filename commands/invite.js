module.exports = {
    exec: function (msg, args) {
        let things = args.split(" ");
        bot.createMessage(msg.channel.id, msg.t("BOT_INVITE"));
    },
    name: "invite",
    isCmd: true,
    category: 1,
    display: true,
    description: "Invite the bot into your server! :)",
    args: "[permission] [guild id]"
};