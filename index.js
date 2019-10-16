"use strict";
/* eslint-disable no-console */
process.on("unhandledRejection", (r) => {
    console.log(`${__filename}      | Unhandled rejection, reason:\n ${require("util").inspect(r)}`);
});
process.on("uncaughtException", (err) => {
    console.log(`${__filename}      | Unhandled exception`, err.message);
    console.log(err.stack);
});
console.log(__filename + "     | Running the bot......");
require("./lib/load")()
