const e = require("express"),
    app = e(),
    util = require("./util"),
    {checkAuth, checkAuthNeg, loadMiddleware, getGuilds, getHost} = util,
    passport = require("passport"),
    scope = ["identify", "guilds"],
    {createServer: httpsServer} = require("https");

loadMiddleware(app);
app.get("/", (rq, rs) => {
    rs.render("landing", rq.makeTemplatingData())
})

app.get("/acceptcookie", (rq, rs) => {
    const p = rq.query.redir || "/";
    const {host} = rq.headers;
    const domain = getHost(host);
    if (rq.signedCookies.dataOk !== "ok") rs.cookie("dataOk", "ok", { //yeah dont
        signed: true,
        expires: new Date("Fri, 31 Dec 9999 23:59:59 GMT"),
        domain
    });
    rs.redirect(p.startsWith("/") ? p : "/").end(); // prevent redirecting somewhere we are not suposed to
})

app.get("/dashboard", checkAuth, (rq, rs) => {
    const guilds = getGuilds(rq, rs)
    rs.render("dashboard", rq.makeTemplatingData({
        guilds,
        pageTitle: "Dashboard"
    }))
})

app.get("/dashboard/:id", checkAuth, async (rq, rs) => {
    const guilds = getGuilds(rq, rs);
    if (!guilds.find(g => g.isOnServer && g.id == rq.params.id)) return rs.sendStatus(403);
    else {
        const data = await db.table("configs").get(rq.params.id);
        const g = bot.guilds.get(rq.params.id);
        return rs.render("dashboard-server", rq.makeTemplatingData({
            guild: data,
            erisGuild: g,
            pageTitle: `${g.name} Dashboard`
        }))
    }
})
app.get("/login", checkAuthNeg, passport.authenticate("discord", { scope }), function (req, res) { req; res; return; });
app.get("/callback",
    passport.authenticate("discord", { failureRedirect: "/" }), function (req, res) { req; res.redirect("/"); } // auth success
);

app.get("/logout", checkAuth, function (req, res) {
    req.logout();
    res.redirect("/");
});

app.use("/api", require("./routes/api"))


app.get("/error", (rq,rs) => {throw new Error("Intentional error")})


app.use((err, req, res, next) => {
    if (err) {
        console.error(err)
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

if (config.httpsPort) httpsServer(config.httpsSettings)
                      .listen(config.httpsPort, config.webserverip || "0.0.0.0", () => {
                          console.log("HTTPS webserver is running")
                      });