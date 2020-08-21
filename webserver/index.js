/**
 * Copyright (C) 2020 tt.bot dev team
 * 
 * This file is part of tt.bot.
 * 
 * tt.bot is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * tt.bot is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with tt.bot.  If not, see <http://www.gnu.org/licenses/>.
 */

"use strict";
const e = require("polka"),
    util = require("./util"),
    { checkAuth, checkAuthNeg, loadMiddleware, getGuilds, getHost } = util,
    scope = ["identify", "guilds"],
    { createServer: httpsServer } = require("https"),
    { createServer: httpServer } = require("http"),
    { getAccessToken, logout } = require("./util/auth"),
    csrf = require("csurf"),
    fs = require("fs"),
    csrfProtection = csrf({
        value: req =>
            req.body && req.body._csrf ||
            req.query && req.query._csrf ||
            req.query && req.query.state ||
            req.headers["csrf-token"] ||
            req.headers["xsrf-token"] ||
            req.headers["x-csrf-token"] ||
            req.headers["x-xsrf-token"]
    }),
    { Logger } = require("sosamba"),
    serveStatic = require("./util/static"),
    { availableTypes } = require("../lib/logging"),
    UserProfile = require("../lib/Structures/UserProfile"),
    OwnerCommand = require("../lib/commandTypes/OwnerCommand");


module.exports = function (db, bot, config) {
    const log = new Logger({
        name: "Webserver"
    });
    const app = e({
        onError: (err, req, res) => {
            if (err.code && err.code === "ebadcsrftoken".toUpperCase()) {
                res.status(403);
                res.render("500", req.makeTemplatingData({
                    error: "Missing CSRF token! Please redo the action again in order to protect yourself.",
                    pageTitle: "Cross Site Request Forgery"
                }));
                return;
            }

            log.error(err);
            res.status(500);
            res.render("500", req.makeTemplatingData({
                error: req.user && OwnerCommand.prototype.permissionCheck.call(null, { author: req.user }) ? err.stack : err.message,
                pageTitle: "Error"
            }));
        },
        onNoMatch: (rq, rs) => {
            rs.status(404);
            rs.render("404", rq.makeTemplatingData({
                pageTitle: "404"
            }));
        }
    });

    loadMiddleware(app, bot, log);
    app.get("/", (rq, rs) => {
        rs.render("landing", rq.makeTemplatingData());
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
            const data = {
                id: rq.params.id,
                prefix: config.prefix
            };
            await db.createGuildConfig(data);
            return data;
        }
        const guilds = getGuilds(rq, rs);
        if (!guilds.find(g => g.isOnServer && g.id === rq.params.id)) return rs.sendStatus(403);
        else {
            const data = await db.getGuildConfig(rq.params.id) || await makeCfg();
            const g = bot.guilds.get(rq.params.id);
            return rs.render("dashboard-server", rq.makeTemplatingData({
                guild: data,
                erisGuild: g,
                pageTitle: g.name,
                availableLoggingTypes: availableTypes,
                locales: Object.keys(bot.i18n.languages)
            }));
        }
    });

    app.get("/profile/load.js", checkAuth(), csrfProtection(), async (rq, rs) => {
        rs.setHeader("Content-Type", "application/javascript");
        return rs.render("cspprofile", {
            csrfToken: rq.csrfToken()
        }, false);
    });

    app.get("/dashboard/:id/load.js", checkAuth(), csrfProtection(), async (rq, rs) => {
        const guilds = getGuilds(rq, rs);
        if (!guilds.find(g => g.isOnServer && g.id === rq.params.id)) return rs.sendStatus(403);
        else {
            const g = bot.guilds.get(rq.params.id);
            rs.setHeader("Content-Type", "application/javascript");
            return rs.render("cspstuff", {
                guildID: g.id,
                csrfToken: rq.csrfToken()
            }, false);
        }
    });
    app.get("/dashboard/:id/extensions/:extension/load.js", checkAuth(), csrfProtection(), async (rq, rs) => {
        const { id, extension } = rq.params;
        const guilds = getGuilds(rq, rs);
        if (!guilds.find(g => g.isOnServer && g.id === id)) return rs.sendStatus(403);
        else {
            rs.setHeader("Content-Type", "application/javascript");
            return rs.render("cspextensions", {
                extension
            }, false);
        }
    });
    app.get("/login", checkAuthNeg(), csrfProtection(), function (req, res) {
        return res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${config.clientID}&scope=${encodeURIComponent(scope.join(" "))}&response_type=code&redirect_uri=${encodeURIComponent(`${req.protocol}://${req.headers.host}/callback`)}&state=${req.csrfToken()}`);
    });
    app.get("/callback", csrfProtection({
        ignoreMethods: ["HEAD", "OPTIONS"]
    }), async function (req, res) {
        if (req.query.error) return res.redirect("/");
        if (!req.query.code) return res.redirect("/login");
        else {
            try {
                await getAccessToken(req.query.code, req);
            } catch (err) {
                log.error(err);
                return res.redirect("/login");
            }
            await new Promise((rs, rj) => req.session.save(e => e ? rj(e) : rs()));
            return res.redirect("/");
        }
    });

    app.get("/dashboard/:id/extensions", checkAuth(), async (rq, rs) => {
        const guilds = getGuilds(rq, rs);
        if (!guilds.find(g => g.isOnServer && g.id === rq.params.id)) return rs.sendStatus(403);
        else {
            const g = bot.guilds.get(rq.params.id);
            const extensions = await db.getGuildExtensions(rq.params.id);
            rs.render("extensions", rq.makeTemplatingData({
                erisGuild: g,
                extensions,
                pageTitle: `Extensions for ${g.name}`
            }));
        }
    });

    app.get("/dashboard/:id/extensions/:extension", checkAuth(), async (rq, rs) => {
        const guilds = getGuilds(rq, rs);
        if (!guilds.find(g => g.isOnServer && g.id === rq.params.id)) return rs.sendStatus(403);
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
            const extension = await db.getGuildExtension(rq.params.extension);
            if (!extension || extension && extension.guildID !== g.id) {
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
        if (!guilds.find(g => g.isOnServer && g.id === rq.params.id)) return rs.sendStatus(403);
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
            const extension = await db.getGuildExtension(rq.params.extension);
            if (!extension || extension && extension.guildID !== g.id) {
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

    app.get("/profile", checkAuth(), async (rq, rs) => {
        const profileData = await db.getUserProfile(rq.user.id);
        if (!profileData) {
            return rs.render("profile-create", rq.makeTemplatingData({
                pageTitle: "Profile",
                locales: Object.keys(bot.i18n.languages),
            }));
        } else {
            const profile = new UserProfile(profileData);
            return rs.render("profile", rq.makeTemplatingData({
                pageTitle: "Profile",
                locales: Object.keys(bot.i18n.languages),
                profile
            }));
        }
    });

    app.get("/logout", checkAuth(), async function (req, res) {
        await logout(req, res);
        res.redirect("/");
    });

    require("./routes/api")(app, csrfProtection, db);
    app.use("/monaco", serveStatic(app, `${__dirname}/../node_modules/monaco-editor/min`));
    app.get("/tt.bot.d.ts", async (_, rs) => {
        let result = "";
        const ttbotTs = await fs.promises.readFile(`${__dirname}/../lib/extensions/tt.bot.d.ts`);
        const chainfetchTs = await fs.promises.readFile(require.resolve("chainfetch/typings/index.d.ts"));
        
        result += ttbotTs;
        result += "\n";
        result += chainfetchTs;
        rs.end(result);
    });
    app.get("/robots.txt", async (_, rs) => {
        rs.end(`User-agent: *
Disallow: /static
Disallow: /monaco
Disallow: /dashboard
Disallow: /login
Disallow: /tt.bot.d.ts
Disallow: /api`);
    });

    httpServer(app.handler).listen(config.httpPort || 8090, config.webserverip || "0.0.0.0", () => {
        //eslint-disable-next-line no-console
        console.log("HTTP webserver is running.");
    });

    if (config.httpsPort) httpsServer(config.httpsSettings, app.handler)
        .listen(config.httpsPort, config.webserverip || "0.0.0.0", () => {
            //eslint-disable-next-line no-console
            console.log("HTTPS webserver is running");
        });
};
