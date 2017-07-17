module.exports = function () {
    global.config = require("./config.json");
    if (!config.token) {
        console.log(__filename + "     | ERR: Missing token");
        process.exit(1);
    } else if (!config.oid) {
        console.log(__filename + "      | ERR: Missing owner ID.");
        process.exit(1);
    } else if (!config.dbotskey || config.dbotskey == "") {
        console.log(__filename + "      | WARN: Missing Discord Bots API key. Posting the server count into Discord Bots is disabled.");
    } else if (!config.prefix || config.prefix == "") {
        console.log(__filename + "      | ERR: Missing prefix.");
        process.exit(1);
    } else {
        return;
    }
};