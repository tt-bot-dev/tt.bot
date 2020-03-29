"use strict";
const { Eris: { Permission } } = require("sosamba");
const OwnerCommand = require("../../lib/commandTypes/OwnerCommand");
module.exports = {
    checkAuth(api = false) {
        return (req, res, next) => {
            if (req.signedIn) return next();
            if (api) {
                res.status(401).send({
                    error: "Unauthorized",
                    description: "You aren't authorized."
                });
                return next();
            }
            res.redirect("/login");
        };
    },

    checkAuthNeg(api = false) {
        return (req, res, next) => {
            if (!req.signedIn) return next();
            if (api) {
                res.status(403).send({
                    error: "Forbidden",
                    description: "You are authorized already."
                });
                return next();
            }
            res.redirect("/");
            next();
        };
    },
    loadMiddleware: require("./loadMiddleware"),
    getGuilds(req, res) {
        if (!req.user) return res.redirect("/login");
        if (!req.user.guilds) return res.redirect("/login");
        if (OwnerCommand.prototype.permissionCheck.call(null, {
            author: req.user
        })) {
            return [
                ...req.bot.guilds.values(),

                ...req.user.guilds.filter(g => {
                    const permission = new Permission(g.permissions);
                    return !req.bot.guilds.has(g.id) && (permission.has("administrator") || permission.has("manageGuild"));
                })
            ].map(g => Object.assign({}, g, {
                isOnServer: req.bot.guilds.has(g.id)
            }));
        }
        return req.user.guilds.filter(g => {
            if (req.bot.guilds.has(g.id)) return req.bot.isAdmin(req.bot.guilds.get(g.id).members.get(req.user.id));
            else {
                const permission = new Permission(g.permissions);
                return permission.has("administrator") || permission.has("manageGuild");
            }

        }).map(g => Object.assign({}, g, {
            isOnServer: req.bot.guilds.has(g.id)
        }));
    },

    getHost(host) {
        if (host.indexOf(":") === -1) return host;
        return host.slice(0, host.lastIndexOf(":"));
    }
};