const eventFolder = `${__dirname}/../events`;
const readdir = fs.promises ? fs.promises.readdir : require("util").promisify(fs.readdir) 
module.exports = async () => {
    const events = await readdir(eventFolder);
    console.log(events)
    events.forEach(e => {
        if (/.+\.js$/.test(e)) {
            const event = require(`${eventFolder}/${e}`);
            if (event.isEvent) {
                console.log(`${__filename}      | Loading ${e.replace(/\.js$/, "")} event, file ${e}`);
                bot.on(e.replace(/\.js$/, ""), event);
            }
            else console.log(__filename + "    | Skipping non-event " + e);
        } else {
            console.log(__filename + "     | Skipping non-JS " + e);
        }
    });
};