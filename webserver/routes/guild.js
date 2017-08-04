const { Router } = require("express");
const app = Router();
app.get("/", checkOwner, (req, res) => {
    res.render("guild-list", req.makeTemplatingData({
        guilds: bot.guilds.filter(() => true)
    }));

});
app.get("/botcolls", checkOwner, (req, res) => {
    res.render("botcoll", req.makeTemplatingData());
});
app.get("/botcolls/prune", checkOwner, (req, res) => {
    if (req.query.yes == "true") {
        if (bot.listBotColls().length > 0) {
            bot.listBotColls().forEach(g => g.leave());
            res.redirect("/guilds/botcolls");
        } else {
            res.redirect("/guilds/botcolls");
        }
    } else {
        res.render("delete",
            req.makeTemplatingData({
                guild: {
                    name: "All bot collection servers"
                }
            }));
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
            res.render("404", req.makeTemplatingData());
        }
    } else {
        res.render("delete", req.makeTemplatingData({ guild }));
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
    } else {
        res.status(404);
        res.render("404", req.makeTemplatingData());
    }
});
app.get("/:id", checkOwner, (req, res) => {
    let guild = bot.guilds.get(req.params.id);
    if (guild) return res.render("guild", req.makeTemplatingData({ guild })); else {
        res.status(404);
        res.render("404", req.makeTemplatingData());
    }
});
app.get("/:id/members", checkOwner, (req, res) => {
    let guild = bot.guilds.get(req.params.id);
    if (guild) return res.render("guild-members", req.makeTemplatingData({ guild })); else {
        res.status(404);
        res.render("404", req.makeTemplatingData());
    }
});

function checkOwner(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.id == config.oid) return next();
    }
    res.send("You're not owner.");
}


module.exports = app;