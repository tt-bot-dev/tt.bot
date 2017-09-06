const e = require("express"),
    app = e(),
    bodyParser = require("body-parser"),
    ejs = require("ejs"),
    passport = require("passport"),
    dStrategy = require("passport-discord").Strategy,
    cookieparser = require("cookie-parser"),
    session = require("express-session"),
    appstore = require("express-session-rethinkdb")(session),
    store = new appstore({
        connectOptions: config.connectionOpts
    });

app.enable("trust proxy");
app.use(bodyParser.urlencoded({
    extended: true,
    parameterLimit: 10000,
    limit: "5mb"
}));
app.use(bodyParser.json({
    parameterLimit: 10000,
    limit: "5mb"
}));
app.set("json spaces", 2);

app.engine("ejs", ejs.renderFile);
app.set("views", `${__dirname}/views`);
app.set("view engine", "ejs");
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

const scope = ["identify", "guilds"];

passport.use(new dStrategy({
    clientID: config.clientID,
    clientSecret: config.clientSecret,
    callbackURL: `http://${config.webserverip ? (config.webserverip == "0.0.0.0" ? "127.0.0.1" : config.webserverip) : "127.0.0.1"}:${config.webserverport || "8090"}/callback`,
    scope
}, function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
        return done(null, profile);
    });
}));

app.use(session({
    secret: config.clientSecret,
    resave: false,
    saveUninitialized: false,
    store: store
}));
app.use(cookieparser());
app.use(passport.initialize());
app.use(passport.session());
app.use((rq, rs, nx) => {
    rs;
    rq.makeTemplatingData = function (...objects) {
        let obj = {
            user: rq.isAuthenticated() ? {
                username: rq.user.username,
                discriminator: rq.user.discriminator,
                avatar: `https://cdn.discordapp.com/avatars/${rq.user.id}/${rq.user.avatar}.png`,
                id: rq.user.id
            } : null
        };
        if (objects.length == 0) return obj;
        return Object.assign(obj, ...objects);
    };
    nx();
});
app.get("/login", checkAuthNeg, passport.authenticate("discord", { scope }), function (req, res) { req; res; return; });
app.get("/callback",
    passport.authenticate("discord", { failureRedirect: "/" }), function (req, res) { req; res.redirect("/"); } // auth success
);

app.get("/logout", checkAuth, function (req, res) {
    req.logout();
    res.redirect("/");
});


function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}

function checkAuthNeg(req, res, next) {
    if (!req.isAuthenticated()) return next();
    res.send("you're logged in already :)");
}

async function getGuildData(req, res) {
    if (!req.user) return res.redirect("/login");
    if (!req.user.guilds) return res.redirect("/login");
    return req.user.guilds.map(async g => {
        const bg = bot.guilds.get(g.id);
        const u = bot.users.get(req.user.id);
        if (!bg && (!((parseInt(g.permissions) >> 5) & 1) || !((parseInt(g.permissions) >> 3) & 1))) {
            return { show: false };
        }
        let data = {
            name: g.name,
            id: g.id,
            icon: g.icon ? (`https://cdn.discordapp.com/icons/${g.id}/${g.icon}.jpg`) :
            "https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_place_black_24px.svg",
            botIsInGuild: !!bg,
            isMod: false,
            show: true
        };
        if (u && bg) {
            const m = bg.members.get(u.id);
            if (!m) return data;
            else {
                data.isMod = await bot.isModerator(m);
                return data
            }
        };
    });
}

app.get("/", (req, res) => {
    res.render("landing", req.makeTemplatingData());
});
app.use("/guilds", require("./routes/guild"));
app.use("/tags", require("./routes/tag"));
app.use((err, req, res, next) => {
    if (err) {
        res.status(500).render("500", req.makeTemplatingData({
            error: (req.user && isO({ author: req.user })) ? err.stack : err.message
        }));
    }
    next;
});
app.use((req, res) => {
    res.status(404).render("404", req.makeTemplatingData());
});
app.listen(config.webserverport || 8090, config.webserverip || "0.0.0.0", () => {
    console.log("Webserver is running.");
});