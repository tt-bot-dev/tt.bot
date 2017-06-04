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
                if (cmFL.isCmd) {
                    console.log(`${__filename}      | Loading ${cmN} command, file ${cmF}`)
                    cmds[cmN.toLowerCase()] = cmFL;
                }
                else console.log(__filename + "    | Skipping non-command " + cmF)
            } catch (err) {
                console.error(`Error while loading command ${cmN}: ${err}`)
                console.error(err)
            }

        } else {
            console.log(__filename + "     | Skipping non-JS " + cmF)
        }
    }
}
ex.load = function (cmN) {
    if (fs.existsSync(`./commands/${cmN}.js`)) {
        let cmFL
        let n = cmN.toString()
        try {
            cmFL = require("./commands/" + cmN + ".js")
        } catch (err) {
            console.error(`Error while loading command ${cmN}: ${err}`)
            console.error(err)
        }
        if (cmFL.isCmd) {
            console.log(`${__filename}      | Loading ${cmN} command, file ${cmN}`)
            if (cmFL.aliases) {
                cmFL.aliases.forEach(a => cmdAliases[a] = n.toLowerCase() )
            }
            cmds[n.toLowerCase()] = cmFL;
        }
        else console.log(__filename + "    | Skipping non-command " + cmN)
    } else {
        console.log(__filename + "     | Skipping non-existent " + cmN)
    }
}
ex.reload = function (cmN) {
    if (cmds[cmN])
    try {
        cmds[cmN] = rld(`./commands/${cmN}.js`);
    }catch(err) {
        console.error(err);
    }
    else throw new Error("Command isn't loaded. Use cmdWrap.load to load the command.")
}
ex.unload = function (cmN) {
    if (cmds[cmN])
        delete cmds[cmN]
    else throw new Error("Command isn't loaded. Use cmdWrap.load to load the command.")
}