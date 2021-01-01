/**
 * Copyright (C) 2021 tt.bot dev team
 * 
 * This file is part of tt.bot.
 * 
 * tt.bot is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * tt.bot is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with tt.bot.  If not, see <http://www.gnu.org/licenses/>.
 */

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
