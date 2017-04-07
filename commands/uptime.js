module.exports = {
    exec: async function (msg, args) {
        function getUptime(moment1, moment2) {
            var diff = moment.duration(moment1.diff(moment2));
            var diffString = `${diff.days() > 0 ? diff.days() + ' days, ' : ''}${diff.hours() > 0 ? diff.hours() + ' hours, ' : ''}${diff.minutes()} minutes, and ${diff.seconds()} seconds`;
            return diffString
        }
        msg.channel.createMessage(`I've been up for **${getUptime(moment(), moment(Date.now() - bot.uptime))}**.`)
    },
    isCmd: true,
    display: true,
    category: 1,
    description: "Shows for how long is the bot up.",
}