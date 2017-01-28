process.stdin.resume();
process.stdin.setEncoding('utf8');
global.fs = require("fs")
process.stdin.on('data', (chu) => {
    var chunk = chu.toString();
    if (chunk.startsWith("shutdown")) {
        process.exit(0);
    } else if (chunk.startsWith("eval ")) {
        let slice = chunk.slice("eval ".length);
        try { console.log(eval(slice)) } catch (err) { console.error(err) };
    }
})
process.on("unhandledRejection", (r, p) => {
    console.log(`${__filename}      | Unhandled rejection, reason:\n ${require("util").inspect(r)}`)
})
process.on("uncaughtException", (err) => {
    console.log(`${__filename}      | Unhandled exception`, err.message)
    console.error(err.stack)
})
global.p = function (p) { return; };
global.cmds = {};
global.rCQueue = {};
global.userQuery = require("./queryUsers.js");
console.log(__filename + "    | Starting TTtie Bot......")
console.log()
console.log(__filename + "     | Checking configuration......")
console.log()
require("./checkConfig")();
console.log(__filename + "     | Running the bot......")
require("./discord")()
