module.exports = {
    exec: function (msg, args) {
        queries.guild(args, msg).then(g => {
            bot.createMessage(msg.channel.id, {
                embed: {
                    author: {
                        name: `${g.name} (${g.id})`,
                        icon_url: g.iconURL
                    },
                    fields: [{
                        name: "Members",
                        value: `${g.members.size}\n(${g.members.filter(fn => fn.bot).length} bots)`
                    }]
                }
            });

        });
    },
    isCmd: true,
    name: "gsearch",
    display: true,
    category: 2,
    description: "Search for a guild."
};