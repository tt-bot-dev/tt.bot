const qBase = require("../queries/query");
function qC(msg, iQuery) {
    return new qBase(iQuery, msg.guild.channels.filter(c => c.type == 0), query => fn => {
        // saving all users in an array where it finds these formats
        // username, id, mention (<@!id> or <@id>), nickname, username#1234 or nickname#1234 - case insensitive
        if (fn.name == query || fn.id == query || `<#${fn.id}>` == query || fn.name.startsWith(query)) return true;
        else if (fn.name.toLowerCase() == query.toLowerCase() || fn.name.toLowerCase().startsWith(query.toLowerCase())) return true;
        else return false; // we ignore other users
    }, c => {
        let str = `${c.name} (${c.id})`;
        if (c.type == 0) str += ` (${c.mention})`;
        return str;
    });
}
module.exports = {
    exec: async function (msg, args) {
        if (args) {
            if (args == "disable") {
                delete msg.guildConfig.farewellChannelId;
                delete msg.guildConfig.farewellMessage;
                await db.table("configs").get(msg.guild.id).replace(msg.guildConfig).run();
                await msg.channel.createMessage("Reset the farewells.");
                return;
            }
            let splitargs = args.split(" | ");
            let options = {};
            await splitargs.forEach(async fe => {
                if (fe.match(/(message:([^]{1,500}))/i)) {
                    if (!options.message) {
                        options.message = fe.replace(/message:/, "").replace(/ \\\| /g, " | ");
                    }
                } else if (fe.match(/(channel:([^]{2,32}))/i)) {
                    if (!options.channel) {
                        options.channel = fe.replace(/channel:/, "").replace(/ \\\| /g, " | ");
                    }
                } else {
                    msg.channel.createMessage(msg.t("INVALID_ARG", `\`${fe}\``))
                }
            });

            if (options.channel) {
                try {
                    options.channel = await qC(msg, options.channel).start(msg);
                } catch (err) {
                    options.channel = msg.channel;
                }
                msg.guildConfig.farewellChannelId = options.channel.id;
                msg.guildConfig.farewellMessage = options.message || "{u.mention} has left **{g.name}**.";
                await db.table("configs").get(msg.guild.id).update(msg.guildConfig).run();
                return await msg.channel.createMessage(msg.t("FAREWELL_UPDATED", msg.guildConfig.farewellMessage, options.channel.id));
            } else return await msg.channel.createMessage(msg.t("ARGS_MISSING"));
        }
    },
    isCmd: true,
    display: true,
    category: 4,
    description: "Farewell messages.",
    args: "<disable|<message:[ttMsg compatible message](https://github.com/TTtie/TTtie-Bot/wiki/ttMsg)> | channel:<channel>>"
};