const CommandPath = `${__dirname}/../commands`;
const ex = module.exports = {};
const { promisify } = require("util");
const readdir = fs.promises ? fs.promises.readdir : promisify(fs.readdir);
const access = fs.promises ? fs.promises.access : promisify(fs.access);
const {constants: {F_OK}} = require("fs");
global.rld = (rq => p => {
    const path = rq.resolve(p);
    const mod = rq.cache[path];
    delete rq.cache[path];
    let rld;
    try {
        rld = rq(path);
    } catch(_) {
        rq.cache[path] = mod;
        throw _;
    }
    return rld;
})(require);
ex.loadAll = async function () {
    const commands = await readdir(CommandPath);
    commands.forEach(command => {
        if (/.+\.js$/.test(command)) {
            let commandName = command.match(/(.+)\.js$/)[1];
            try {
                let loadedCommand = require(`${CommandPath}/${command}`);
                if (loadedCommand.isCmd) {
                    console.log(`${__filename}      | Loading ${commandName} command, file ${command}`);
                    cmds[commandName.toLowerCase()] = loadedCommand;
                    if (loadedCommand.aliases) {
                        loadedCommand.aliases.forEach(a => cmdAliases[a] = commandName.toLowerCase());
                    }
                }
                else console.log(__filename + "      | Skipping non-command " + command);
            } catch (err) {
                console.error(`Error while loading command ${commandName}: ${err}`);
                console.error(err);
            }

        } else {
            console.log(__filename + "     | Skipping non-JS " + command);
        }
    });
};
ex.load = async function (name) {
    if (await access(`${CommandPath}/${name}.js`, F_OK).catch(() => false)) {
        let command;
        let name = name.toString();
        try {
            command = require(`${CommandPath}/${name}.js`);
        } catch (err) {
            console.error(`Error while loading command ${name}: ${err}`);
            console.error(err);
            throw err;
        }
        if (command.isCmd) {
            console.log(`${__filename}      | Loading ${name} command, file ${name}`);
            if (command.aliases) {
                command.aliases.forEach(a => cmdAliases[a] = name.toLowerCase());
            }
            cmds[name.toLowerCase()] = command;
        }
        else console.log(__filename + "    | Skipping non-command " + name);
    } else {
        console.log(__filename + "     | Skipping non-existent " + name);
        throw new Error("Command doesn't exist.");
    }
};
ex.reload = function (cmN) {
    if (cmds[cmN])
        try {
            if (cmds[cmN].aliases) {
                cmds[cmN].aliases.forEach(a => delete cmdAliases[a]);
            }
            let rel = rld(`${CommandPath}/${cmN}.js`);
            cmds[cmN] = rel;
            if (cmds[cmN].aliases) {
                cmds[cmN].aliases.forEach(a => cmdAliases[a] = cmN.toLowerCase());
            }
        } catch (err) {
            console.error(err);
        }
    else throw new Error("Command isn't loaded. Use cmdWrap.load to load the command.");
};
ex.unload = function (cmN) {
    if (cmds[cmN]) {
        if (cmds[cmN].aliases) {
            cmds[cmN].aliases.forEach(a => delete cmdAliases[a]);
        }
        delete cmds[cmN];
    }
    else throw new Error("Command isn't loaded. Use cmdWrap.load to load the command.");
};