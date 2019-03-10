module.exports = {
    exec: async function (msg) {
        const configs = (await db.table("configs")).filter(({id}) => !bot.guilds.get(id));
        const modlogItems = (await db.table("modlog")).filter(({id}) => !bot.guilds.get(id));
        configs.forEach(async ({id}) => await db.table("configs").get(id).delete());
        modlogItems.forEach(async ({id}) => await db.table("modlog").get(id).delete());
        msg.channel.createMessage(`Sweeping is done! Removed ${configs.length} server configs and ${modlogItems.length} modlogs.`);
    },
    isCmd: true,
    display: true,
    category: 2,
    description: "Nukes unneeded data.",
    aliases: [
        "sweep"
    ]
};