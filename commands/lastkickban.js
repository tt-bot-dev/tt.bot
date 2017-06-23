module.exports = {
    exec: async function (msg, args) {
        let log
        try {
            log = await msg.guild.getAuditLogs()
        } catch (err) {
            return await msg.channel.createMessage("Cannot get the logs, don't I lack the permission to?")
        }
        function matchesCriteria(l) {
            if (l.actionType == 20) return true;
            if (l.actionType == 21) return true;
            if (l.actionType == 22) return true;
            if (l.actionType == 23) return true;
            else return false;
        }
        let lastEntry = log.entries.filter(matchesCriteria)[0]
        if (!lastEntry) return await msg.channel.createMessage(`Somehow, there aren't no last audit log items.`)
        async function makeEmbed() {
            let base = {
                author: {
                    name: `${bot.getTag(lastEntry.user)}`,
                    icon_url: lastEntry.user.avatarURL
                },
                description: `%EMOJI% %ACTION% %USERTAG%`,
                fields: [],
                color: undefined
            }
            if (lastEntry.reason) base.fields.push({
                name: `Reason`,
                value: lastEntry.reason,
                inline: true
            });
            let target = lastEntry.actionType !== 21 ? (lastEntry.target || await bot.getUserWithoutRESTMode(lastEntry.targetID)) : null
            switch (lastEntry.actionType) {
                case 20:
                    base.description = base.description.replace("%EMOJI%", ":boot:").replace("%ACTION%", "Kicked").replace("%USERTAG%", bot.getTag(target))
                    base.color = 0xf6ff00
                    break;
                case 21:
                    base.description = base.description.replace("%EMOJI%", ":wastebasket:").replace("%ACTION%", "Pruned").replace("%USERTAG%", "the server")
                    base.fields.push({
                        name: `Members pruned`,
                        value: `${lastEntry.membersRemoved} members`,
                        inline: true
                    })
                    base.fields.push({
                        name: `Pruning inactivity days`,
                        value: `${lastEntry.deleteMemberDays} days`,
                        inline: true
                    })
                    base.color = 0xe8d212
                    break;
                case 22:
                    base.description = base.description.replace("%EMOJI%", ":hammer:").replace("%ACTION%", "Banned").replace("%USERTAG%", bot.getTag(target))
                    base.color = 0xff0000
                    break;
                case 23:
                    base.description = base.description.replace("%EMOJI%", ":hammer:").replace("%ACTION%", "Unbanned").replace("%USERTAG%", bot.getTag(target))
                    base.color = 0xff8411
                    break;
            }
            return base;
        }
        msg.channel.createMessage({
            embed: await makeEmbed()
        })
    },
    isCmd: true,
    display: true,
    category: 1,
    description: "Shows the last (un)ban/kick/prune from auditlogs.",
    aliases: [
        "lastkick",
        "lastban",
        "lastprune"
    ]
}