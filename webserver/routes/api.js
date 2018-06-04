const { Router, json } = require("express");
const app = Router();
const { checkAuth, getGuilds } = require("../util/index");
/* 
app.use(json({
    parameterLimit: 10000,
    limit: "5mb"
})); */
app.get("/channels/:guild", checkAuth, (rq, rs) => {
    const guilds = getGuilds(rq, rs);
    if (!guilds.find(g => g.isOnServer && g.id == rq.params.guild)) return rs.status(403).send({ error: "Forbidden" });
    else {
        const guild = bot.guilds.get(rq.params.guild);
        return rs.send(guild.channels.filter(c => c.type === 0).map(c => ({
            name: c.name,
            id: c.id
        })));
    }
})

app.get("/config/:guild", checkAuth, async (rq, rs) => {
    const guilds = getGuilds(rq, rs);
    if (!guilds.find(g => g.isOnServer && g.id == rq.params.guild)) return rs.status(403).send({ error: "Forbidden" });
    else {
        const data = await db.table("configs").get(rq.params.guild);
        return rs.send(data);
    }
})

app.get("/roles/:guild", checkAuth, (rq, rs) => {
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

app.post("/config/:guild", checkAuth, async (rq, rs) => {
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
            "memberRole"]; // filter out the nonsense
        const filteredBody = {};
        Object.keys(rq.body).filter(k => props.includes(k)).forEach(k => {
            filteredBody[k] = rq.body[k] || undefined;
        });

        filteredBody.id = rq.params.guild;

        await db.table("configs").get(rq.params.guild).replace(filteredBody);
        return rs.send(await db.table("configs").get(rq.params.guild))
    }
})

module.exports = app;