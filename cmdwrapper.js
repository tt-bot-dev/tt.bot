let ex = module.exports = {};
global.rld = require("require-reload")(require)
ex.loadAll = function() {
    let fa = fs.readdirSync("./commands");
    for (let i= 0; i < fa.length; i++) {
        let cmF = fa[i];
        if (/.+\.js$/.test(cmF)) {
            let cmN = cmF.match(/(.+)\.js$/)[1]
            let cmFL = require("./commands/" + cmN  + ".js")
            if (cmFL.isCmd) {
                console.log(`${__filename}      | Loading ${cmN} command, file ${cmF}`)
                cmds[cmFL.name] = cmFL;
            }
            else console.log(__filename + "    | Skipping non-command " + cmF)
        } else {
            console.log(__filename + "     | Skipping non-JS " + cmF)
        }
    }
}
ex.load = function(cmN) {
    let cmFL = require("./commands/" + cmN  + ".js")
    if (cmFL.isCmd) {
        console.log(`${__filename}      | Loading ${cmN} command, file ${cmF}`)
        cmds[cmFL.name] = cmFL;
    }
    else console.log(__filename + "    | Skipping non-command " + cmF)
}
ex.reload = function(cmN) {
    cmds[cmN] = rld(`./commands/${cmN}.js`);
}
ex.unload = function(cmN) {
    cmds[cmN] = undefined;
}