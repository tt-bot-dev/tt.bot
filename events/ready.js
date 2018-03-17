const {WorkerTypes} = require("../util/worker");
module.exports = async function () {
    console.log(`${__filename}      | Connected as ${this.user.username}#${this.user.discriminator}`);
    global.connected = true;
    global.cmdWrap = require("../cmdwrapper");
    for (let i = 0; i< config.workerCount; i++) await Promise.all(Object.values(WorkerTypes).map(w => this.workers.startWorker(w)));
    cmdWrap.loadAll();
    this.editStatus("online", { name: `Type ${config.prefix}help`, type: 0 });
    this.postStats().then(console.log(__filename + "     | Successfully posted!"), r => console.log(r.body));
    this.postStats2().then(console.log(__filename + "     | Successfully posted 2!"), r => console.log(r.body));
    this.listBotColls().forEach(g => g.leave());
    let blacklist = await db.table("blacklist").run();
    blacklist.forEach(b => {
        if (!b) return;
        let g = bot.guilds.get(b.id);
        if (!g) return;
        if (g.id == b.id) return g.leave();
        if (b.ownerID && g.ownerID == b.ownerID) return g.leave();
    });
};
module.exports.isEvent = true;