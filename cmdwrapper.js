let ex = module.exports = {};
global.rld = require("require-reload")(require)
ex.loadAll = function () {
    let fa = fs.readdirSync("./commands");
    for (let i = 0; i < fa.length; i++) {
        let cmF = fa[i];
        if (/.+\.js$/.test(cmF)) {
            let cmN = cmF.match(/(.+)\.js$/)[1]
            try {
                let cmFL = require("./commands/" + cmN + ".js")
            } catch (err) {
                console.error(`Error while loading command ${cmN}: ${err}`)
            }
            if (cmFL.isCmd) {
                console.log(`${__filename}      | Loading ${cmN} command, file ${cmF}`)
                cmds[cmN] = cmFL;
            }
            else console.log(__filename + "    | Skipping non-command " + cmF)
        } else {
            console.log(__filename + "     | Skipping non-JS " + cmF)
        }
    }
}
ex.load = function (cmN) {
    if (fs.existsSync(`./commands/${cmN}.js`)) {
        try {
            let cmFL = rld("./commands/" + cmN + ".js")
        } catch (err) {
            console.error(`Error while loading command ${cmN}: ${err}`)
        }
        if (cmFL.isCmd) {
            console.log(`${__filename}      | Loading ${cmN} command, file ${cmF}`)
            cmds[cmN] = cmFL;
        }
        else console.log(__filename + "    | Skipping non-command " + cmF)
    } else {
        console.log(__filename + "     | Skipping non-existent " + cmF)
    }
}
ex.reload = function (cmN) {
    if (cmds[cmN])
        cmds[cmN] = rld(`./commands/${cmN}.js`);
    else throw new Error("Command isn't loaded. Use cmdWrap.load to load the command.")
}
ex.unload = function (cmN) {
    if (cmds[cmN])
        delete cmds[cmN]
    else throw new Error("Command isn't loaded. Use cmdWrap.load to load the command.")
}