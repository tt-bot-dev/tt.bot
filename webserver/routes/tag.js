const { Router } = require("express");
const app = Router();
const tagStruct = require("../Structures/TagObject")
app.get("/", checkOwner, async (req, res) => {
    res.render("tag-list", req.makeTemplatingData({
        tags: (await db.table("tags").run()).map(t => new tagStruct(t))
    }));
});
app.get("/delete/:id", checkOwner, async (req, res) => {
    let data = await db.table("tags").get(req.params.id);
    if (!data) {
        res.status(404);
        return res.render("404", req.makeTemplatingData());
    }
    if (req.query.yes == "true") {
        await db.table("tags").get(req.params.id).delete();
        res.redirect("/tags/");
    }
    data = new tagStruct(data)
    res.render("delete", req.makeTemplatingData({
        guild: {
            name: `tag named ${data.id}`
        }
    }));
});
app.get("/view/:id", checkOwner, async (req, res) => {
    let data = await db.table("tags").get(req.params.id);
    if (!data) {
        res.status(404);
        return res.render("404", req.makeTemplatingData());
    }
    res.render("tag-details", req.makeTemplatingData({
        tag: new tagStruct(data)
    }));
});

function checkOwner(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.id == config.oid) return next();
    }
    res.send("You're not owner.");
}
module.exports = app;