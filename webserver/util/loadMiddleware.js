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
const config = require("../../config"),
    ejs = require("ejs"),
    cookieparser = require("cookie-parser"),
    session = require("express-session"),
    cookies = require("./cookies"),
    body = require("body-parser"),
    auth = require("./auth"),
    SessionStore = require("./SessionStore")(session),
    serveStatic = require("./static"),
    send = require("@polka/send-type"),
    redirect = require("@polka/redirect"),
    { STATUS_CODES } = require("http"),
    { sign } = require("cookie-signature"),
    { serialize } = require("cookie"),
    { version } = require("../../package.json");
module.exports = (app, bot, log) => {

    const sessionStore = new SessionStore(bot.db, log, {});
    app.use((rq, rs, nx) =>  {
        log.debug(`${rq.method} ${rq.url}`);
        rq.bot = bot;
        rs.redirect = (...args) => redirect(rs, ...args);
        rq.protocol = rq.headers["x-forwarded-proto"] || (rq.connection.encrypted ? "https" : "http");
        rs.status = status => void (rs.statusCode = status);
        rs.send = body => send(rs, rs.statusCode, body);
        rs.sendStatus = code => {
            rs.statusCode = code;
            rs.end(STATUS_CODES[code] || code);
        };
        rs.render = (file, data = {}, isHTML = true) => {
            let p = `${__dirname}/../views/${file}`;
            if (!p.endsWith(".ejs")) p += ".ejs";
            ejs.renderFile(p, data, (err, str) => {
                if (err) nx(err);
                else send(rs, 200, str, isHTML ? { "Content-Type": "text/html" } : {});
            });
        };
        rs.cookie = (name, value, options) => {
            const opts = Object.assign({}, options);
            const { secret } = rq;
          
            let val = typeof value === "object"
                ? "j:" + JSON.stringify(value)
                : String(value);
          
            if (options.signed) {
                val = "s:" + sign(val, secret);
            }
          
            if ("maxAge" in opts) {
                opts.expires = new Date(Date.now() + opts.maxAge);
                opts.maxAge /= 1000;
            }
          
            if (opts.path == null) {
                opts.path = "/";
            }
          
            rs.setHeader("Set-Cookie", serialize(name, val, opts));
        };
        nx();
    });
    if (config.serveStatic) app.use("/static", serveStatic(app, `${__dirname}/../static`));
    app.use(body.urlencoded({
        extended: true,
        parameterLimit: 10000,
        limit: "5mb"
    }));
    app.use(body.json({
        parameterLimit: 10000,
        limit: "5mb"
    }));
    app.use((rq, _, nx) => {
        rq.makeTemplatingData = function (...objects) {
            let obj = {
                user: rq.signedIn ? {
                    ...rq.user,
                    avatar: rq.user.avatar ? `https://cdn.discordapp.com/avatars/${rq.user.id}/${rq.user.avatar}.png` : `https://cdn.discordapp.com/embed/avatars/${rq.user.discriminator % 5}.png`,
                } : null,
                pageTitle: "",
                isHTTP: !rq.secure,
                host: rq.headers.host,
                bot: rq.bot,
                config,
                ttbotVersion: version
            };
            if (objects.length === 0) return obj;
            return Object.assign(obj, ...objects);
        };
        nx();
    });
    app.use(cookieparser(config.clientSecret));
    app.use(cookies);
    app.use(session({
        secret: config.clientSecret,
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        cookie: {
            maxAge: 8064e5
        }
    }));
    app.use(auth.checkAuth);
};