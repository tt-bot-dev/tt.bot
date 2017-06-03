module.exports = async function () {
    console.log(`${__filename}      | Connected as ${bot.user.username}#${bot.user.discriminator}`)
    global.connected = true;
    global.cmdWrap = require("../cmdwrapper")
    cmdWrap.loadAll()
    bot.editStatus("online", { name: `Type ${config.prefix}help` })
    bot.postStats().then(console.log(__filename + "     | Successfully posted!"), r => console.log(r.body))
    bot.postStats2().then(console.log(__filename + "     | Successfully posted 2!"), r => console.log(r.body))
    global.keymetricsMetrics = new keymetrics();
    bot.listBotColls().forEach(g => g.leave());
    let blacklist = await db.table("blacklist").run();
    blacklist.forEach(b => {
        let g = bot.guilds.get(b.id);
        if (g.id == b.id) return g.leave();
        if (b.ownerID && g.ownerID == b.ownerID) return g.leave()
        
    })
}
module.exports.isEvent = true