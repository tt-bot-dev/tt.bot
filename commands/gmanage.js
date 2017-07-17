module.exports = {
    exec: async function (msg, args) {
        if (isO(msg) && args) {
            let action = args.split(" ")[0];
            if (action) {
                let flags = args.split(" ").slice(1).join(" ");
                let parseFlags = flags.split(" | ");
                let options = {};
                await parseFlags.forEach(async fe => {
                    if (fe.match(/(reason:([^]{1,500}))/i)) {
                        if (!options.reason) {
                            options.reason = fe.replace(/reason:/, "").replace(" \\| ", " | ");
                        }
                    } else if (fe.match(/(guild:([^]{2,32}))/i)) {
                        if (!options.channel) {
                            try {
                                options.guild = await queries.guild(fe.replace(/guild:/, "").replace(" \\| ", " | "), msg);
                            } catch (err) {
                                options.guild = undefined;
                            }
                        }
                    } else if (fe.match(/(guildID:([0-9]{17,18}))/)) {
                        options.guild = {id: fe.replace(/guildID:/, "")};
                    } else {
                        console.log(fe + " doesn't match any regexes.");
                    }
                });
                if (action == "blacklist") {
                    if (options && options.guild.id) {
                        await db.table("blacklist").insert({
                            id: options.guild.id,
                            ownerID: options.guild.ownerID || null,
                            reason: options.reason || null
                        }).run();
                        bot.guilds.filter(g => {
                            if (g.id == options.guild.id) return true;
                            else if (options.guild.ownerID && g.ownerID == options.guild.ownerID) return true;
                            else return false;
                        }).forEach(g => g.leave());
                        msg.channel.createMessage(`Blacklisted ${options.guild.name || "guild ID"} (${options.guild.id}) ${options.guild.ownerID ? `and its owner's (${options.guild.members.get(options.guild.ownerID).username}#${options.guild.members.get(options.guild.ownerID).discriminator} (${options.guild.ownerID})) guilds` : ""} for ${options.reason || "no reason"}`);
                    }
                } else if (action == "whitelist") {
                    if (options && options.guild.id) {
                        let data = await db.table.get(options.guild.id).run();
                        if (data) {
                            await db.table.get(options.guild.id).delete().run();
                            msg.channel.createMessage(`Unblacklisted guild ${options.guild.id} ${data.ownerID? `and its owner with ID ${data.ownerID}.` : "." }`);
                        }
                    }
                }
            }
        }
    },
    isCmd: true,
    display: true,
    category: 2,
    description: "Blacklist/whitelist a guild.",
    args: "<blacklist|whitelist>"
};