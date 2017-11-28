let db;
try {
    db = require("rethinkdbdash")(require("./config.json").connectionOpts);
} catch (err) {
    console.error("You haven't installed rethinkdbdash npm module or you don't have configured the bot yet! Please do so.");
}
(async function () {
    if (!db) return;
    const dbs = await db.tableList();
    if (!dbs.includes("blacklist")) await db.tableCreate("blacklist");
    if (!dbs.includes("session")) await db.tableCreate("session");
    if (!dbs.includes("configs")) await db.tableCreate("configs");
    if (!dbs.includes("feedback")) await db.tableCreate("feedback");
    if (!dbs.includes("tags")) await db.tableCreate("tags");
    if (!dbs.includes("profile")) await db.tableCreate("profile");
    if (!dbs.includes("modlog")) await db.tableCreate("modlog");
    if (!dbs.includes("extensions")) await db.tableCreate("extensions")
    return console.log("All set up!");
})();