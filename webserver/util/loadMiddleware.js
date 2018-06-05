const e = require("express"),
    bodyParser = require("body-parser"),
    ejs = require("ejs"),
    cookieparser = require("cookie-parser"),
    session = require("express-session"),
    appstore = require("express-session-rethinkdb")(session),
    store = new appstore({
        connectOptions: config.connectionOpts
    }),
    util = require("./"),
    scope = ["identify", "guilds"],
    cookies = require("./cookies"),
    body = require("body-parser"),
    auth = require("./auth");
module.exports = app => {
    app.use("/static", e.static(`${__dirname}/../static`))
    app.enable("trust proxy");
    app.use(body.urlencoded({
        extended: true,
        parameterLimit: 10000,
        limit: "5mb"
    }));
    app.use(body.json({
        parameterLimit: 10000,
        limit: "5mb"
    }));
    app.set("json spaces", 2);
    app.engine("ejs", ejs.renderFile);
    app.set("views", `${__dirname}/../views`);
    app.set("view engine", "ejs");
    
    
    app.use(cookieparser(config.clientSecret));
    app.use((rq, rs, nx) => {
        rq.makeTemplatingData = function (...objects) {
            let obj = {
                user: rq.isAuthenticated() ? {
                    username: rq.user.username,
                    discriminator: rq.user.discriminator,
                    avatar: `https://cdn.discordapp.com/avatars/${rq.user.id}/${rq.user.avatar}.png`,
                    id: rq.user.id
                } : null,
                pageTitle: "",
                isHTTP: !rq.secure,
                host: rq.headers.host
            };
            if (objects.length == 0) return obj;
            return Object.assign(obj, ...objects);
        };
        nx();
    });
    app.use(cookies)
    app.use(session({
        secret: config.clientSecret,
        resave: false,
        saveUninitialized: false,
        store: store,
        cookie: {
            maxAge: 8064e5
        }
    }));
    app.use(auth.checkAuth);
};