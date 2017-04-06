module.exports = {
    exec: async function (msg, args) {
        if (msg.guildConfig && msg.guildConfig.prefix !== config.prefix) {
            bot.createMessage(msg.channel.id, `The actual prefix for this server is \`${msg.guildConfig.prefix}\`.\nYou can still use \`${config.prefix}\` prefix. `)
        } else {
            bot.createMessage(msg.channel.id, `This server hasn't set any prefix. You can use \`${config.prefix}\` prefix.`)
        }
    },
    isCmd: true,
    display: true,
    category: 1,
    description: "Gets a server prefix.",
}