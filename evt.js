let fi = fs.readdirSync("./events");
fi.forEach(e => {
    if (/.+\.js$/.test(e)) {
        let cmFL = require("./events/" + e);
        if (cmFL.isEvent) {
            console.log(`${__filename}      | Loading ${e.replace(/\.js/, "")} event, file ${e}`);
            bot.on(e.replace(/\.js/, ""), cmFL);
        }
        else console.log(__filename + "    | Skipping non-event " + e);
    } else {
        console.log(__filename + "     | Skipping non-JS " + e);
    }
});