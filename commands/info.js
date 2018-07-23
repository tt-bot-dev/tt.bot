module.exports = {
    exec: function (msg) {
        const getOwnerInfo = owner => `<@${owner.id}> (${owner ? owner.username + "#" + owner.discriminator : "Sorry, my owner isn't in my cache ;-;"})`;
        const ownerStrings = Array.isArray(config.oid) ? config.oid.map(i => getOwnerInfo(bot.users.get(i))) :  [getOwnerInfo(bot.users.get(config.oid))];
        function getUptime(moment1, moment2) {
            var diff = moment.duration(moment1.diff(moment2));
            var diffString = `${diff.days() > 0 ? diff.days() + " days, " : ""}${diff.hours() > 0 ? diff.hours() + " hours, " : ""}${diff.minutes()} minutes, and ${diff.seconds()} seconds`;
            return diffString;
        }
        
        return bot.createMessage(msg.channel.id, {
            embed: {
                author: {
                    name: bot.user.username,
                    icon_url: bot.user.staticAvatarURL, //returns static avatar no matter if you have a gif avatar
                },
                fields: [{
                    name: msg.t("INFO_STATS"),
                    value: msg.t("INFO_STATS_TEXT"),
                    inline: true
                }, {
                    name: msg.t("INFO_AUTHORS"),
                    value: msg.t("INFO_OWNERS", ownerStrings),
                    inline: true
                }, {
                    name: msg.t("INFO_VERSIONS"),
                    value: `tt.bot: ${require("../package.json").version}\nEris: ${require("eris/package.json").version}\nNode.js: ${process.versions.node}\nV8 engine: ${process.versions.v8}`,
                    inline: true
                },
                {
                    name: msg.t("INFO_UPTIME"),
                    value: getUptime(moment(), moment(Date.now() - bot.uptime)),
                    inline: true
                }],
                color: 0x008800
            }
        });
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
};