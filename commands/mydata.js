module.exports = {
    exec: async function (msg, args) {
        const m = await msg.channel.createMessage({
            embed: {
                author:{
                    name: "Please wait."
                },
                description: `We're getting your data.`
            }
        });
        const filter = f => {
            if (!bot.guilds.get(f.id)) return false;
            const guild = bot.guilds.get(f.id);
            return guild.ownerID === msg.author.id;
        };
        const profile = msg.userProfile;
        const servers = (await db.table("configs")).filter(filter);
        const modlogs = (await db.table("modlog")).filter(filter);
        const tags = (await db.table("tags")).filter(f => f.owner === msg.author.id);
        const fields = [];
        if (profile) fields.push({
            name: `Profile`,
            value: `Profile fields: ${profile.profileFields.length}\nTimezone: ${profile.timezone || "None"}`
        })
        if (servers && servers.length > 0) fields.push({
            name: `Your servers`,
            value: `Here are their IDs:\n${servers.map(s => s.id).join("\n")}` 
        })
        if (modlogs && modlogs.length > 0) fields.push({
            name: `Your servers with mod logs`,
            value: `Here are their IDs:\n${modlogs.map(s => s.id).join("\n")}` 
        })
        if (tags && tags.length > 0) fields.push({
            name: `Your tags`,
            value: `${tags.map(f => decryptData(f.id).join("\n"))}`
        })
        await m.edit({
            embed: {
                author: {
                    name: `Here's what we know about you.`
                },
                fields
            }
        })
    },
    isCmd: true,
    category: 1,
    display: true,
    description: "Shows an overview of your data and allows you to delete it.",
    args: ""
};