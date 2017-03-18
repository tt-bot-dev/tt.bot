const probe = require("pmx").probe();
class KeymetricsMetrics {
    constructor(){
        this.guildMetric = probe.metric({
            name: "Guilds",
            value: () => bot.guilds.size
        })
        this.channelMetric = probe.metric({
            name: "Channels",
            value: () => Object.keys(bot.channelGuildMap).length
        })
        this.userMetric = probe.metric({
            name: "Users",
            value: () => bot.users.size
        })
    }
}
module.exports = KeymetricsMetrics