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
                return await msg.channel.createMessage(msg.t("SETTING_UPDATED", setting, value));
            } else {
                return await msg.channel.createMessage(msg.t("SETTING_UNKNOWN", setting));
            }
        }
        else {
            let server = await db.table("configs").get(msg.guild.id).run();
            if (!server) server = await makeCfg();
            let items = [];
            Object.keys(server).forEach(item => {
                if (item != "id") items.push(`${item} - ${server[item]}`);
            });
            return await bot.createMessage(msg.channel.id, msg.t("GUILD_CONFIG", msg.guild.name, items));
        }
    },
    isCmd: true,
    name: "config",
    display: true,
    category: 4,
    description: "This lets you configure your server.",
    args: "[<item> <value>]"
};