const e = require("express"),
    app = e(),
    util = require("./util"),
    { checkAuth, checkAuthNeg, loadMiddleware, getGuilds, getHost } = util,
    scope = ["identify", "guilds"],
    { createServer: httpsServer } = require("https"),
    { getAccessToken, logout } = require("./util/auth");
    
loadMiddleware(app);
app.get("/", (rq, rs) => {
    rs.render("landing", rq.makeTemplatingData());
});

app.get("/acceptcookie", (rq, rs) => {
    const p = rq.query.redir || "/";
    const { host } = rq.headers;
    const domain = getHost(host);
    if (rq.signedCookies.dataOk !== "ok") rs.cookie("dataOk", "ok", { //yeah dont
        signed: true,
        expires: new Date("Fri, 31 Dec 9999 23:59:59 GMT"),
        domain
    });
    rs.redirect(p.startsWith("/") ? p : "/"); // prevent redirecting somewhere we are not supposed to
});

app.get("/dashboard", checkAuth, (rq, rs) => {
    const guilds = getGuilds(rq, rs);
    rs.render("dashboard", rq.makeTemplatingData({
        guilds,
        pageTitle: "Dashboard"
    }));
});

app.get("/dashboard/:id", checkAuth, async (rq, rs) => {
    
    async function makeCfg() {
        await db.table("configs").insert({
            id: rq.params.id,
            modRole: "tt.bot mod",
            prefix: config.prefix
        });
        return await db.table("configs").get(rq.params.id).run();
    }
    const guilds = getGuilds(rq, rs);
    if (!guilds.find(g => g.isOnServer && g.id == rq.params.id)) return rs.sendStatus(403);
    else {
        const data = await db.table("configs").get(rq.params.id) || await makeCfg();
        const g = bot.guilds.get(rq.params.id);
        return rs.render("dashboard-server", rq.makeTemplatingData({
            guild: data,
            erisGuild: g,
            pageTitle: `${g.name} Dashboard`
        }));
    }
});
app.get("/login", checkAuthNeg, function (req, res) {
    return res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${config.clientID}&scope=${encodeURIComponent(scope.join(" "))}&response_type=code&redirect_uri=${encodeURIComponent(`${req.protocol}://${req.headers.host}/callback`)}`);
});
app.get("/callback", async function (req, res) {
    if (!req.query.code) return res.redirect("/login");
    else {
        try {
            await getAccessToken(req.query.code, req);
        } catch (err) {
            console.error(err);
            return res.redirect("/login");
        }

        try{
            await (new Promise((rs, rj) => req.session.save(e => e?rj(e):rs())));
        } catch(err) {
            throw err;
        }
        return res.redirect("/");
    }
});

app.get("/logout", checkAuth, function (req, res) {
    logout(req, res);
    res.redirect("/");
});

app.use("/api", require("./routes/api"));

app.use((err, req, res, next) => {
    if (err) {
        console.error(err);
        res.status(500).render("500", req.makeTemplatingData({
            error: (req.user && isO({ author: req.user })) ? err.stack : err.message,
            pageTitle: "Error"
        }));
    }
    next;
});
app.listen(config.httpPort || 8090, config.webserverip || "0.0.0.0", () => {
    console.log("HTTP webserver is running.");
});

if (config.httpsPort) httpsServer(config.httpsSettings, app)
    .listen(config.httpsPort, config.webserverip || "0.0.0.0", () => {
        console.log("HTTPS webserver is running");
    });