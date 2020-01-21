"use strict";
const { checkAuth, getGuilds } = require("../util/index");
const createUUID = require("uuid/v4");
const uuidregex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const authNeeded = checkAuth(true);
module.exports = (app, csrf, db) => {
    app.get("/api/channels/:guild", authNeeded, (rq, rs) => {
        const guilds = getGuilds(rq, rs);
        if (!guilds.find(g => g.isOnServer && g.id === rq.params.guild)) return rs.status(403).send({ error: "Forbidden" });
        else {
            const guild = rq.bot.guilds.get(rq.params.guild);
            return rs.send(guild.channels.filter(c => c.type === 0).sort((a, b) => a.position - b.position).map(c => ({
                name: c.name,
                id: c.id
            })));
        }
    });

    app.get("/api/config/:guild", authNeeded, async (rq, rs) => {
        const guilds = getGuilds(rq, rs);
        if (!guilds.find(g => g.isOnServer && g.id === rq.params.guild)) return rs.status(403).send({ error: "Forbidden" });
        else {
            const data = await db.getGuildConfig(rq.params.guild);
            return rs.send(data);
        }
    });

    app.get("/api/roles/:guild", authNeeded, (rq, rs) => {
        const guilds = getGuilds(rq, rs);
        if (!guilds.find(g => g.isOnServer && g.id === rq.params.guild)) return rs.status(403).send({ error: "Forbidden" });
        else {
            const guild = rq.bot.guilds.get(rq.params.guild);
            const highestRole = guild.members.get(rq.bot.user.id).roles
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

    app.post("/api/config/:guild", authNeeded, csrf(), async (rq, rs) => {
        const guilds = getGuilds(rq, rs);
        if (!guilds.find(g => g.isOnServer && g.id === rq.params.guild)) return rs.status(403).send({ error: "Forbidden" });
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
                "modlogChannel",
                "locale"];
            const filteredBody = {};
            Object.keys(rq.body).filter(k => props.includes(k)).forEach(k => {
                filteredBody[k] = rq.body[k] || null;
            });

            filteredBody.id = rq.params.guild;

            await db.updateGuildConfig(rq.params.guild, filteredBody);
            return rs.send(await db.getGuildConfig(rq.params.guild));
        }
    });

    app.get("/api/extensions/:guild/:id", authNeeded, async (rq, rs) => {
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
        if (!guilds.find(g => g.isOnServer && g.id === guild)) return rs.status(403).send({ error: "Forbidden" });
        else {
            if (id === "new") return rs.send(d);
            const filteredBody = {};
            const extension = await db.getGuildExtension(id);
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

    app.post("/api/extensions/:guild/:id", authNeeded, csrf(), async (rq, rs) => {
        const { guild, id } = rq.params;
        const guilds = getGuilds(rq, rs);
        if (!guilds.find(g => g.isOnServer && g.id === guild)) return rs.status(403).send({ error: "Forbidden" });
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
            const extension = id === "new" ? { guildID: guild } : await db.getGuildExtension(id);
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
            if (filteredBody.commandTrigger.length > 20)
                filteredBody.commandTrigger = filteredBody.commandTrigger.slice(0, 20);
            if (!uuidregex.test(filteredBody.store)) filteredBody.store = null;
            if (id === "new") {
                delete filteredBody.id;
                const tryInsert = async () => {
                    const id = createUUID();
                    try {
                        await db.createGuildExtensionStore(guild, id);
                        return id;
                    } catch (_) {
                        // Try to insert with a different id
                        return tryInsert();
                    }
                };
                //eslint-disable-next-line require-atomic-updates
                filteredBody.store = filteredBody.store || await tryInsert();
                const tryInsertExtension = async () => {
                    const id = createUUID();
                    try {
                        filteredBody.id = id;
                        await db.createGuildExtension(filteredBody);
                        return id;
                    } catch {
                        return tryInsertExtension();
                    }
                };

                const newID = await tryInsertExtension();
                return rs.send(await db.getGuildExtension(newID));
            } else {
                await db.updateGuildExtension(id, filteredBody);
                return rs.send(await db.getGuildExtension(id));
            }
        }
    });

    app.delete("/api/extensions/:guild/:id", authNeeded, csrf(), async (rq, rs) => {
        const { guild, id } = rq.params;
        const guilds = getGuilds(rq, rs);
        if (!guilds.find(g => g.isOnServer && g.id === guild)) return rs.status(403).send({ error: "Forbidden" });
        else {
            const extension = await db.getGuildExtension(id);
            if (!extension || (extension && extension.guildID !== guild)) {
                rs.status(404);
                rs.send({ error: "Not Found" });
                return;
            }

            const { deleteStore } = rq.body;
            await db.deleteGuildExtension(id);
            if (deleteStore) {
                await db.deleteGuildExtensionStore(guild, extension.store);
            }
            return rs.status(204).end();
        }
    });

    if (config.dblVoteHook) {
        app.post("/api/dblvotes", async (rq, rs) => {
            const pass = async () => {
                if (rq.body.type !== "test") rq.bot.createMessage(config.serverLogChannel, {
                    content: `<@!${rq.body.user}> (${rq.bot.getTag(await bot.getUserWithoutRESTMode(rq.body.user))}), thank you!\nIf you are here, you should be given a vote role reward if it exists!`,
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
                //eslint-disable-next-line no-console
                console.log("Test passed.");
                pass();
                return;
            }

            const guild = rq.bot.guilds.get(config.dblVoteHookGuild);
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