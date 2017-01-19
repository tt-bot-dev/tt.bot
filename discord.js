module.exports = function () {
    global.fs = require("fs");
    const cfg = require("./config.json")
    global.ErisO = require("eris");
    global.Eris = require("./libutil")
    const bot = new Eris(cfg.token);
    global.isO = function(msg) {
        return msg.author.id == config.oid
    }
    global.connected = false;
    bot.connect()
    global.bot = bot;
    global.cmds = {};
    require("./evt")
}