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
            return rs.send(guild.channels.filter(c => c.type === 0).map(c => ({
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
            return rs.send(guild.roles.filter(r => r.position < highestRole.position).map(r => ({
                name: r.name,
                id: r.id
            })).sort((a, b) => b.position - a.position));
        }
    });

    app.post("/config/:guild", authNeeded, csrf(), async (rq, rs) => {
        console.log(`POST /config/:guild\n:guild = ${rq.params.guild}\nbody = ${require("util").inspect(rq.body)}`);
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