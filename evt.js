let fa = fs.readdirSync("./events");
for (let i= 0; i < fa.length; i++) {
    let cmF = fa[i];
    if (/.+\.js$/.test(cmF)) {
        let cmN = cmF.match(/(.+)\.js$/)[1];
        let cmFL = require("./events/" + cmN  + ".js");
        if (cmFL.isEvent) {
            console.log(`${__filename}      | Loading ${cmN} event, file ${cmF}`);
            bot.on(cmN, cmFL);
        }
        else console.log(__filename + "    | Skipping non-event " + cmF);
    } else {
        console.log(__filename + "     | Skipping non-JS " + cmF);
    }
}