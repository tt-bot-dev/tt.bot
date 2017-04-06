module.exports = {
    exec: async function (msg, args) {
        if (msg.guildConfig) {
            bot.createMessage(msg.channel.id, `The actual prefix for this server is \`${msg.guildConfig.prefix}\`.\nYou can still use \`tt.\` prefix. `)
        } else {
            bot.createMessage(msg.channel.id, "This server hasn't set any prefix. You can use `tt.` prefix")
        }
    },
    isCmd: true,
    display: true,
    category: 1,
    description: "Gets a server prefix.",
}