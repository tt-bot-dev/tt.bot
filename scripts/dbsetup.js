let db;
try {
    db = require("rethinkdbdash")(require("../config").connectionOpts);
} catch (err) {
    console.error("You haven't installed rethinkdbdash npm module or you didn't have configured the bot yet! Please do so.");
}
(async function () {
    if (!db) return;
    const tables = await db.tableList();
    if (!tables.includes("blacklist")) await db.tableCreate("blacklist");
    if (!tables.includes("session")) await db.tableCreate("session");
    if (!tables.includes("configs")) await db.tableCreate("configs");
    if (!tables.includes("feedback")) await db.tableCreate("feedback");
    if (!tables.includes("tags")) await db.tableCreate("tags");
    if (!tables.includes("profile")) await db.tableCreate("profile");
    if (!tables.includes("modlog")) await db.tableCreate("modlog");
    if (!tables.includes("extensions")) await db.tableCreate("extensions");
    if (!tables.includes("extension_store")) await db.tableCreate("extension_store");
    if (!tables.includes("phone")) await db.tableCreate("phone");
    console.log("All set up!");
    process.exit(0);
})();
