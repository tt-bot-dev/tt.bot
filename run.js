process.on("unhandledRejection", (r) => {
    console.log(`${__filename}      | Unhandled rejection, reason:\n ${require("util").inspect(r)}`);
});
process.on("uncaughtException", (err) => {
    console.log(`${__filename}      | Unhandled exception`, err.message);
    console.log(err.stack);
});
global.p = function () { return; };
global.cmds = {};
console.log(__filename + "     | Running the bot......");
require("./moduleloader");
