module.exports = {
    exec: async function (msg, args) {
        async function makeCfg() {
            await db.table("configs").insert({
                id: msg.guild.id,
                modRole: "tt.bot mod",
                prefix: config.prefix
            });
            return await db.table("configs").get(msg.guild.id).run();
        }
        if (await bot.isModerator(msg.member)) {
            if (args) {
                let c = args.split(" ");
                let setting = c[0];
                let value = c.slice(1).join(" ");
                let server = await db.table("configs").get(msg.guild.id).run();
                if (!server) server = await makeCfg();
                if (setting && value && server[setting]) {
                    server[setting] = value;
                    await db.table("configs").get(msg.guild.id).update(server).run();
                    return await msg.channel.createMessage(`Updated ${setting} to ${value}`);
                } else {
                    return await msg.channel.createMessage(`Unknown setting ${setting}`);
                }
            }
            else {
                let server = await db.table("configs").get(msg.guild.id).run();
                if (!server) server = await makeCfg();
                let items = [];
                Object.keys(server).forEach(item => {
                    if (item != "id") items.push(`${item} - ${server[item]}`);
                });
                return await bot.createMessage(msg.channel.id, `\`\`\`\nServer configuration for ${msg.guild.name}\n${items.join("\n")}\`\`\``);
            }
        }
    },
    isCmd: true,
    name: "config",
    display: true,
    category: 3,
    description: "Configuration.",
    args: "[<item> <value>]"
};