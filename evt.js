let fi = fs.readdirSync("./events");
fi.forEach(e => {
    if (/.+\.js$/.test(e)) {
        let cmN = e.match(/(.+)\.js$/)[1];
        let cmFL = require("./events/" + e  + ".js");
        if (cmFL.isEvent) {
            console.log(`${__filename}      | Loading ${cmN} event, file ${e}`);
            bot.on(cmN, cmFL);
        }
        else console.log(__filename + "    | Skipping non-event " + e);
    } else {
        console.log(__filename + "     | Skipping non-JS " + e);
    }
});