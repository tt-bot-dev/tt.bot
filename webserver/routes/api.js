const { Router } = require("express");
const app = Router();
const { checkAuth, getGuilds } = require("../util/index");
const authNeeded = checkAuth(true);
module.exports = csrf => {
    app.get("/channels/:guild", authNeeded, (rq, rs) => {
        const guilds = getGuilds(rq, rs);
        if (!guilds.find(g => g.isOnServer && g.id == rq.params.guild)) return rs.status(403).send({ error: "Forbidden" });
        else {
            const guild = bot.guilds.get(rq.params.guild);
            return rs.send(guild.channels.filter(c => c.type === 0).sort((a, b) => a.position - b.position).map(c => ({
                name: c.name,
                id: c.id
            })));
        }
    });

    app.get("/config/:guild", authNeeded, async (rq, rs) => {
        const guilds = getGuilds(rq, rs);
        if (!guilds.find(g => g.isOnServer && g.id == rq.params.guild)) return rs.status(403).send({ error: "Forbidden" });
        else {
            const data = await db.table("configs").get(rq.params.guild);
            return rs.send(data);
        }
    });

    app.get("/roles/:guild", authNeeded, (rq, rs) => {
        const guilds = getGuilds(rq, rs);
        if (!guilds.find(g => g.isOnServer && g.id == rq.params.guild)) return rs.status(403).send({ error: "Forbidden" });
        else {
            const guild = bot.guilds.get(rq.params.guild);
            const highestRole = guild.members.get(bot.user.id).roles
                .map(r => guild.roles.get(r))
                .sort((a, b) => b.position - a.position)[0];
            let roles = guild.roles.filter(r => r.position < highestRole.position);
            if (rq.query.ignoreHierarchy === "true") roles = [...guild.roles.values()];
            return rs.send(roles.sort((a, b) => b.position - a.position).map(r => ({
                name: r.name,
                id: r.id
            })));
        }
    });

    app.post("/config/:guild", authNeeded, csrf(), async (rq, rs) => {
        const guilds = getGuilds(rq, rs);
        if (!guilds.find(g => g.isOnServer && g.id == rq.params.guild)) return rs.status(403).send({ error: "Forbidden" });
        else {
            const props = ["prefix",
                "modRole",
                "farewellMessage",
                "farewellChannelId",
                "greetingMessage",
                "greetingChannelId",
                "agreeChannel",
                "memberRole",
                "logChannel",
                "logEvents",
                "modlogChannel"]; // filter out the nonsense
            const filteredBody = {};
            Object.keys(rq.body).filter(k => props.includes(k)).forEach(k => {
                filteredBody[k] = rq.body[k] || undefined;
            });

            filteredBody.id = rq.params.guild;

            await db.table("configs").get(rq.params.guild).replace(filteredBody);
            return rs.send(await db.table("configs").get(rq.params.guild));
        }
    });

    app.get("/extensions/:guild/:id", authNeeded, async (rq, rs) => {
        const d = {
            allowedChannels: [],
            allowedRoles: [],
            commandTrigger: "",
            store: null,
            code: "const { message } = require(\"tt.bot\");\n\nmessage.reply(\"hi!\")",
            name: "My cool extension",
            id: "new"
        };
        const { guild, id } = rq.params;
        const guilds = getGuilds(rq, rs);
        if (!guilds.find(g => g.isOnServer && g.id == guild)) return rs.status(403).send({ error: "Forbidden" });
        else {
            if (id === "new") return rs.send(d);
            const filteredBody = {};
            const extension = await db.table("extensions").get(id);
            if (!extension || (extension && extension.guildID !== guild)) {
                rs.status(404);
                rs.send({ error: "Not Found" });
                return;
            }
            Object.keys(extension).filter(k => Object.keys(d).includes(k)).forEach(k => {
                filteredBody[k] = extension[k] || undefined;
            });

            filteredBody.id = id;
            rs.send(filteredBody);
        }
    });

    app.post("/extensions/:guild/:id", authNeeded, csrf(), async (rq, rs) => {
        const { guild, id } = rq.params;
        const guilds = getGuilds(rq, rs);
        if (!guilds.find(g => g.isOnServer && g.id == guild)) return rs.status(403).send({ error: "Forbidden" });
        else {
            const props = [
                "code",
                "allowedChannels",
                "allowedRoles",
                "commandTrigger",
                "name",
                "store"
            ];
            const filteredBody = {};
            const extension = id === "new" ? {guildID: guild} : await db.table("extensions").get(id);
            if (!extension || (extension && extension.guildID !== guild)) {
                rs.status(404);
                rs.send({ error: "Not Found" });
                return;
            }
            Object.keys(rq.body).filter(k => props.includes(k)).forEach(k => {
                filteredBody[k] = rq.body[k] || undefined;
            });

            filteredBody.id = id;
            filteredBody.guildID = guild;
            if (id === "new") {
                delete filteredBody.id;
                const tryInsert = async () => {
                    const id = await db.uuid();
                    try {
                        await db.table("extension_store").insert({
                            id: [guild, id],
                            store: "{}"
                        }, {
                            conflict: "error"
                        });
                        return id;
                    } catch (_) {
                        // Try to insert with a different id
                        return tryInsert();
                    }
                };

                if (!filteredBody.store) filteredBody.store = await tryInsert();
                const { generated_keys: [newID] } = await db.table("extensions").insert(filteredBody);
                return rs.send(await db.table("extensions").get(newID));
            } else {
                await db.table("extensions").get(id).replace(filteredBody);
                return rs.send(await db.table("extensions").get(id));
            }
        }
    });

    app.delete("/extensions/:guild/:id", authNeeded, csrf(), async (rq, rs) => {
        const { guild, id } = rq.params;
        const guilds = getGuilds(rq, rs);
        if (!guilds.find(g => g.isOnServer && g.id == guild)) return rs.status(403).send({ error: "Forbidden" });
        else {
            const extension = await db.table("extensions").get(id);
            if (!extension || (extension && extension.guildID !== guild)) {
                rs.status(404);
                rs.send({ error: "Not Found" });
                return;
            }
        
            const { deleteStore } = rq.body;
            await db.table("extensions").get(id).delete();
            if (deleteStore) {
                await db.table("extension_store").get([guild, extension.store]).delete();
            }
            return rs.status(204).end();
        }
    });

    if (config.dblVoteHook) {
        app.post("/dblvotes", async (rq, rs) => {
            const pass = async () => {
                if (rq.body.type !== "test") bot.createMessage(config.serverLogChannel, {
                    content: `<@!${rq.body.user}> (${bot.getTag(await bot.getUserWithoutRESTMode(rq.body.user))}), thank you!\nIf you are here, you should be given a vote role reward if it exists!`,
                    embed: {
                        color: 0x008800,
                        author: {
                            name: "Vote feed"
                        },
                        description: `Oh wait, you didn't vote for me yet? Go ahead and do that [here](https://discordbots.org/bot/${bot.user.id}/vote), if you wish!`,
                        timestamp: new Date()
                    }
                });
                rs.send({ status: "OK" });
            };
            if (!rq.headers.authorization || (rq.headers.authorization !== config.dblVoteHookSecret)) return rs.status(403).send({
                error: "Forbidden"
            });

            if (rq.body.type === "test") {
                console.log("Test passed.");
                pass();
                return;
            }

            const guild = bot.guilds.get(config.dblVoteHookGuild);
            if (!guild) return pass();
            const role = guild.roles.get(config.dblVoteHookRole);
            if (!role) return pass();
            const member = guild.members.get(rq.body.user);
            if (!member) return pass();
            if (!member.roles.includes(role.id)) await member.addRole(role.id, "Voting on discordbots.org");
            return pass();
        });
    }
    return app;
};