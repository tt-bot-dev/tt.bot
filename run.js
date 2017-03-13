process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', (chu) => {
    var chunk = chu.toString();
    if (chunk.startsWith("shutdown")) {
        process.exit(0);
    } else if (chunk.startsWith("eval ")) {
        let slice = chunk.slice("eval ".length);
        try { console.log(eval(slice)) } catch (err) { console.error(err) }
    }
})
process.on("unhandledRejection", (r, p) => {
    console.log(`${__filename}      | Unhandled rejection, reason:\n ${require("util").inspect(r)}`)
})
process.on("uncaughtException", (err) => {
    console.log(`${__filename}      | Unhandled exception`, err.message)
    console.error(err.stack)
})
process.on("SIGINT", aaaaaaaaaaaaaaaa => {
    console.log("Received a SIGINT...")
})
global.p = function (p) { return; };
global.cmds = {};
console.log(__filename + "     | Running the bot......")
require("./moduleloader")
