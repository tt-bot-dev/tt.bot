const e = require("express"),
    app = e(),
    util = require("./util"),
    { checkAuth, checkAuthNeg, loadMiddleware, getGuilds, getHost } = util,
    scope = ["identify", "guilds"],
    { createServer: httpsServer } = require("https"),
    { getAccessToken, logout } = require("./util/auth"),
    csrf = require("csurf"),
    fs = require("fs");

const csrfProtection = csrf({
    value: req =>
        (req.body && req.body._csrf) ||
        (req.query && req.query._csrf) ||
        (req.query && req.query.state) ||
        (req.headers["csrf-token"]) ||
        (req.headers["xsrf-token"]) ||
        (req.headers["x-csrf-token"]) ||
        (req.headers["x-xsrf-token"])
});

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

app.get("/dashboard", checkAuth(), (rq, rs) => {
    const guilds = getGuilds(rq, rs);
    rs.render("dashboard", rq.makeTemplatingData({
        guilds,
        pageTitle: "Dashboard"
    }));
});

app.get("/dashboard/:id", checkAuth(), async (rq, rs) => {

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
            pageTitle: `${g.name} Dashboard`,
        }));
    }
});

app.get("/dashboard/:id/load.js", checkAuth(), csrfProtection(), async (rq, rs) => {
    const guilds = getGuilds(rq, rs);
    if (!guilds.find(g => g.isOnServer && g.id == rq.params.id)) return rs.sendStatus(403);
    else {
        const g = bot.guilds.get(rq.params.id);
        // No, this isn't incorrect. Read RFC 4329 + we do support just modern browsers.
        rs.set("Content-Type", "application/javascript");
        return rs.render("cspstuff", {
            guildID: g.id,
            csrfToken: rq.csrfToken()
        });
    }
});
app.get("/dashboard/:id/extensions/:extension/load.js", checkAuth(), csrfProtection(), async (rq, rs) => {
    const { id, extension } = rq.params;
    const guilds = getGuilds(rq, rs);
    if (!guilds.find(g => g.isOnServer && g.id == id)) return rs.sendStatus(403);
    else {
        // No, this isn't incorrect. Read RFC 4329 + we do support just modern browsers.
        rs.set("Content-Type", "application/javascript");
        return rs.render("cspextensions", {
            extension
        });
    }
});
app.get("/login", checkAuthNeg(), csrfProtection(), function (req, res) {
    return res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${config.clientID}&scope=${encodeURIComponent(scope.join(" "))}&response_type=code&redirect_uri=${encodeURIComponent(`${req.protocol}://${req.headers.host}/callback`)}&state=${req.csrfToken()}`);
});
app.get("/callback", csrfProtection({
    ignoreMethods: ["HEAD", "OPTIONS"]
}), async function (req, res) {
    if (!req.query.code) return res.redirect("/login");
    else {
        try {
            await getAccessToken(req.query.code, req);
        } catch (err) {
            console.error(err);
            return res.redirect("/login");
        }

        try {
            await (new Promise((rs, rj) => req.session.save(e => e ? rj(e) : rs())));
        } catch (err) {
            throw err;
        }
        return res.redirect("/");
    }
});

app.get("/dashboard/:id/extensions", checkAuth(), async (rq, rs) => {
    const guilds = getGuilds(rq, rs);
    if (!guilds.find(g => g.isOnServer && g.id == rq.params.id)) return rs.sendStatus(403);
    else {
        const g = bot.guilds.get(rq.params.id);
        const extensions = await db.table("extensions").filter({
            guildID: g.id
        });
        rs.render("extensions", rq.makeTemplatingData({
            erisGuild: g,
            extensions,
            pageTitle: `Extensions for ${g.name}`
        }));
    }
});

app.get("/dashboard/:id/extensions/:extension", checkAuth(), async (rq, rs) => {
    const guilds = getGuilds(rq, rs);
    if (!guilds.find(g => g.isOnServer && g.id == rq.params.id)) return rs.sendStatus(403);
    else {
        const g = bot.guilds.get(rq.params.id);
        if (rq.params.extension === "new") {

            rs.render("extensions-update", rq.makeTemplatingData({
                erisGuild: g,
                extension: {
                    id: "new"
                },
                isMonaco: false
            }));

            return;
        }
        const extension = await db.table("extensions").get(rq.params.extension);
        if (!extension || (extension && extension.guildID !== g.id)) {
            rs.status(404);
            return rs.render("404", rq.makeTemplatingData({
                pageTitle: "404"
            }));
        }

        rs.render("extensions-update", rq.makeTemplatingData({
            erisGuild: g,
            extension: {
                id: extension.id
            },
            isMonaco: false
        }));
    }
});

app.get("/dashboard/:id/extensions/:extension/monaco", checkAuth(), async (rq, rs) => {
    const guilds = getGuilds(rq, rs);
    if (!guilds.find(g => g.isOnServer && g.id == rq.params.id)) return rs.sendStatus(403);
    else {
        const g = bot.guilds.get(rq.params.id);
        if (rq.params.extension === "new") {

            rs.render("extensions-update", rq.makeTemplatingData({
                erisGuild: g,
                extension: {
                    id: "new"
                },
                isMonaco: true
            }));

            return;
        }
        const extension = await db.table("extensions").get(rq.params.extension);
        if (!extension || (extension && extension.guildID !== g.id)) {
            rs.status(404);
            return rs.render("404", rq.makeTemplatingData({
                pageTitle: "404"
            }));
        }

        rs.render("extensions-update", rq.makeTemplatingData({
            erisGuild: g,
            extension: {
                id: extension.id
            },
            isMonaco: true
        }));
    }
});

app.get("/dashboard/:id/extensions/:extension/delete", checkAuth(), async (rq, rs) => {
    const guilds = getGuilds(rq, rs);
    if (!guilds.find(g => g.isOnServer && g.id == rq.params.id)) return rs.sendStatus(403);
    else {
        const g = bot.guilds.get(rq.params.id);
        const extension = await db.table("extensions").get(rq.params.extension);
        if (!extension || (extension && extension.guildID !== g.id)) {
            rs.status(404);
            return rs.render("404", rq.makeTemplatingData({
                pageTitle: "404"
            }));
        }

        rs.render("extensions-delete", rq.makeTemplatingData({
            erisGuild: g,
            extension: {
                name: extension.name,
                id: extension.id,
                store: extension.store
            },
            isMonaco: false
        }));
    }
});

app.get("/logout", checkAuth(), function (req, res) {
    logout(req, res);
    res.redirect("/");
});

app.use("/api", require("./routes/api")(csrfProtection));
app.use("/monaco", e.static(`${__dirname}/../node_modules/monaco-editor/min`));
app.get("/tt.bot.d.ts", (rq, rs) => {
    const s = fs.createReadStream(`${__dirname}/../extensions/tt.bot.d.ts`);
    s.pipe(rs);
});

//eslint-disable-next-line no-unused-vars
app.use((rq, rs) => {
    rs.status(404);
    rs.render("404", rq.makeTemplatingData({
        pageTitle: "404"
    }));
    return;
});
//eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    if (err) {
        if (err.code && err.code === "ebadcsrftoken".toUpperCase()) {
            res.status(403);
            res.render("500", req.makeTemplatingData({
                error: "Missing CSRF token! Please redo the action again in order to protect yourself.",
                pageTitle: "Cross Site Request Forgery"
            }));
            return;
        }
        console.error(err);
        res.status(500);
        res.render("500", req.makeTemplatingData({
            error: (req.user && isO({ author: req.user })) ? err.stack : err.message,
            pageTitle: "Error"
        }));
    }
});
app.listen(config.httpPort || 8090, config.webserverip || "0.0.0.0", () => {
    console.log("HTTP webserver is running.");
});

if (config.httpsPort) httpsServer(config.httpsSettings, app)
    .listen(config.httpsPort, config.webserverip || "0.0.0.0", () => {
        console.log("HTTPS webserver is running");
    });