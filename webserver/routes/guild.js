const Router = require("express").Router;
const app = Router();
app.get("/", checkOwner, (req, res) => {
    res.render("guild-list", {
        user: req.isAuthenticated() ? {
            username: req.user.username,
            discriminator: req.user.discriminator,
            avatar: `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png`,
            id: req.user.id
        } : null,
        guilds: bot.guilds.filter(() => true)
    });
});
app.get("/botcolls", checkOwner, (req, res) => {
    res.render("botcoll", {
        user: req.isAuthenticated() ? {
            username: req.user.username,
            discriminator: req.user.discriminator,
            avatar: `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png`,
            id: req.user.id
        } : null
    });
});
app.get("/botcolls/prune", checkOwner, (req,res) => {
    if (req.query.yes == "true") {
        if (bot.listBotColls().length > 0) {
            bot.listBotColls().forEach(g => g.leave());
            res.redirect("/guilds/botcolls");
        } else {
            res.redirect("/guilds/botcolls");
        }
    } else {
        res.render("delete", {
            guild: {
                name: "All bot collection servers"
            }, user: req.isAuthenticated() ? {
                username: req.user.username,
                discriminator: req.user.discriminator,
                avatar: `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png`,
                id: req.user.id
            } : null
        });
    }
});
app.get("/delete/:id", checkOwner, (req, res) => {
    var guild = bot.guilds.get(req.params.id);
    if (req.query.yes == "true") {
        if (guild) {
            guild.leave();
            res.redirect("/");
        } else {
            res.status(404);
            res.send("invalid guild");
        }
    } else {
        res.render("delete", {
            guild: guild, user: req.isAuthenticated() ? {
                username: req.user.username,
                discriminator: req.user.discriminator,
                avatar: `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png`,
                id: req.user.id
            } : null
        });
    }
});
app.get("/invite/:id", checkOwner, async (req, res) => {
    let guild = bot.guilds.get(req.params.id);
    if (guild) {
        let invite;
        try {
            invite = await guild.defaultChannel.createInvite();
        } catch (err) {
            invite = { error: err };
        }
        res.send(invite.error ? `Error while creating an invite: ${invite.error}` : `The invite code is ${invite.code}`);
    } else return res.end("Invalid guild");
});
app.get("/:id", checkOwner, (req, res) => {
    let guild = bot.guilds.get(req.params.id);
    if (guild) return res.render("guild", {
        guild: guild, user: req.isAuthenticated() ? {
            username: req.user.username,
            discriminator: req.user.discriminator,
            avatar: `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png`,
            id: req.user.id
        } : null
    }); else return res.end("Invalid guild");
});
app.get("/:id/members", checkOwner, (req, res) => {
    let guild = bot.guilds.get(req.params.id);
    if (guild) return res.render("guild-members", {
        guild: guild, user: req.isAuthenticated() ? {
            username: req.user.username,
            discriminator: req.user.discriminator,
            avatar: `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png`,
            id: req.user.id
        } : null
    }); else return res.end("Invalid guild");
});

function checkOwner(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.id == config.oid) return next();
    }
    res.send("You're not owner.");
}


module.exports = app;