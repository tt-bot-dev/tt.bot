/* eslint-disable no-console */
"use strict";
if (process.env.CI) {
    process.exit(0);
}
const { database } = require("../config");
let db;
try {
    db = new (database.provider())(database.options);
} catch (err) {
    console.error("Please set up your database.");
    process.exit(1);
}
(async function () {
    if (!db) return;
    await db.databaseSetup();
    console.log("The database has been set up successfully.");
    process.exit(0);
})();
