module.exports = async function () {
    console.log(`${__filename}      | Connected as ${bot.user.username}#${bot.user.discriminator}`)
    global.connected = true;
    global.cmdWrap = require("../cmdwrapper")
    cmdWrap.loadAll()
    bot.editStatus("online", { name: `Type ${config.prefix}help` })
    bot.postStats().then(console.log(__filename + "     | Successfully posted!"), r => console.log(r.body))
    global.keymetricsMetrics = new keymetrics();
    bot.listBotColls().forEach(g => g.leave());
    let blacklist = await db.table("blacklist").run();
    blacklist.forEach(b => {
        bot.guilds.filter(g => {
            if (g.id == b.id) return true;
            else if (b.ownerID && g.ownerID == b.ownerID) return true;
            else return false;
        })
    })
}
module.exports.isEvent = true