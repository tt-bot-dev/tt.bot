module.exports = {
    exec: function (msg, args) {
        return bot.createMessage(msg.channel.id, {
            embed: {
                author: {
                    name: bot.user.username,
                    icon_url: bot.user.staticAvatarURL, //returns static avatar no matter if you have a gif avatar
                },
                fields: [{
                    name: "Stats",
                    value: `Guilds: ${bot.guilds.size}\nCached users: ${bot.users.size}\nChannels: ${Object.keys(bot.channelGuildMap).length}`,
                    inline:true
                }, {
                    name: "Author",
                    value: "<@"+config.oid+">\n[Support server](https://discord.gg/dq6X66H)\n[Eris website](https://abal.moe/Eris)",
                    inline:true
                }, {
                    name: "Versions:",
                    value: `Eris: ${require("eris/package.json").version}\nNode.js: ${process.versions.node}\nV8 engine: ${process.versions.v8}`
                }],
                color: 0x008800
            }
        })
    },
    isCmd: true,
    name: "info",
    display: true,
    category: 1,
    description: "Need help? Need to contact the owner? There, use this command"
}