module.exports = {
    exec: function (msg, args) {
        let ownerMember = bot.users.get(config.oid);
        function getUptime(moment1, moment2) {
            var diff = moment.duration(moment1.diff(moment2));
            var diffString = `${diff.days() > 0 ? diff.days() + ' days, ' : ''}${diff.hours() > 0 ? diff.hours() + ' hours, ' : ''}${diff.minutes()} minutes, and ${diff.seconds()} seconds`;
            return diffString
        }
        return bot.createMessage(msg.channel.id, {
            embed: {
                author: {
                    name: bot.user.username,
                    icon_url: bot.user.staticAvatarURL, //returns static avatar no matter if you have a gif avatar
                },
                fields: [{
                    name: "Stats",
                    value: `Guilds: ${bot.guilds.size}\nCached users: ${bot.users.size}\nChannels: ${Object.keys(bot.channelGuildMap).length}`,
                    inline: true
                }, {
                    name: "Author and help",
                    value: `<@${config.oid}> (${ownerMember ? ownerMember.username + "#" + ownerMember.discriminator : "Sorry, my owner isn't in my cache ;-;"})\n[Support server](https://discord.gg/pGN5dMq)\n[Eris website](https://abal.moe/Eris)\n[GitHub repository](https://github.com/tttie/tttie-bot)`,
                    inline: true
                }, {
                    name: "Versions:",
                    value: `Eris: ${require("eris/package.json").version}\nNode.js: ${process.versions.node}\nV8 engine: ${process.versions.v8}`,
                    inline: true
                },
                {
                    name: "Uptime:",
                    value: getUptime(moment(), moment(Date.now() - bot.uptime)),
                    inline: true
                }],
                color: 0x008800
            }
        })
    },
    isCmd: true,
    name: "info",
    display: true,
    category: 1,
    description: "Need help? Need to contact the owner? There, use this command",
    aliases: [
        "aboutbot",
        "about"
    ]
}