module.exports = {
    exec: async function (msg, args) {
        if (await bot.isModerator(msg.member) && args) {
            if (args == "disable") {
                delete msg.guildConfig.farewellChannelId;
                delete msg.guildConfig.farewellMessage;
                await db.table("configs").get(msg.guild.id).update(msg.guildConfig).run();
                await msg.channel.createMessage("Reset the farewells.");
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
                        try {
                            options.channel = await queries.channel(fe.replace(/channel:/, "").replace(/ \\\| /g, " | "), msg);
                        } catch (err) {
                            options.channel = msg.channel;
                        }
                    }
                } else {
                    console.log(fe + " doesn't match any regexes.");
                }
            });

            if (options.channel) {
                msg.guildConfig.farewellChannelId = options.channel.id;
                msg.guildConfig.farewellMessage = options.message || "{u.mention} has left **{g.name}**.";
                await db.table("configs").get(msg.guild.id).update(msg.guildConfig).run();
                return await msg.channel.createMessage(`:ok_hand: Updated the leave message to \`${msg.guildConfig.farewellMessage}\`. It will be sent into <#${options.channel.id}>.`);
            } else return await msg.channel.createMessage(`**${msg.author.username}**, I think you haven't filled out the channel where I should post welcome messages.`);
        }
    },
    isCmd: true,
    display: true,
    category: 3,
    description: "Farewell messages.",
    args: "<disable|<message:[ttMsg compatible message](https://github.com/TTtie/TTtie-Bot/wiki/ttMsg) without newlines> | channel:<channel query>>"
};