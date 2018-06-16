module.exports = {
    checkAuth(req, res, next) {
        if (req.signedIn) return next();
        res.redirect("/login");
    },

    checkAuthNeg(req, res, next) {
        if (!req.signedIn) return next();
        res.send("you're logged in already :)");
    },
    loadMiddleware: require("./loadMiddleware"),
    getGuilds(req, res) {
        if (!req.user) return res.redirect("/login");
        if (!req.user.guilds) return res.redirect("/login");
        return req.user.guilds.filter(g => {
            if (bot.guilds.has(g.id)) return bot.isAdmin(bot.guilds.get(g.id).members.get(req.user.id));
            else {
                const permission = new ErisO.Permission(g.permissions);
                return permission.has("administrator") || permission.has("manageServer");
            }

        }).map(g => Object.assign({}, g, {
            isOnServer: bot.guilds.has(g.id)
        }));
    },

    getHost(host) {
        if (host.indexOf(":") === -1) return host;
        return host.slice(0, host.lastIndexOf(":"));
    }
};