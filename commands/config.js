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
            return await bot.createMessage(msg.channel.id, `\`\`\`\nServer configuration for ${msg.guild.name}\n${items.join("\n")}\`\`\`\nEven though the config names are selfexplanatory, it is possible that your settings might bork the configuration.\nIf you want to use the web version instead, go to ${config.webserverDisplay("/")}`);
        }
    },
    isCmd: true,
    name: "config",
    display: true,
    category: 4,
    description: "This lets you configure your server.",
    args: "[<item> <value>]"
};