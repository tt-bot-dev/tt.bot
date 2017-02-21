module.exports = function () {
    console.log(`${__filename}      | Connected as ${bot.user.username}#${bot.user.discriminator}`)
    global.connected = true;
    global.cmdWrap = require("../cmdwrapper")
    cmdWrap.loadAll()
    bot.editStatus("online", { name: "Type tt.help" })
    bot.postStats().then(console.log(__filename + "     | Successfully posted!"), r => console.log(r.body))
}
module.exports.isEvent = true