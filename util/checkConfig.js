module.exports = function () {
    global.config = require("../config");
    if (!config.token) {
        console.log(__filename + "     | ERR: Missing token");
        process.exit(1);
    }
    if (!config.oid) {
        console.log(__filename + "      | ERR: Missing owner ID.");
        process.exit(1);
    }
    if (!config.dbotskey || config.dbotskey == "") {
        console.log(__filename + "      | WARN: Missing Discord Bots API key. Posting the server count into Discord Bots is disabled.");
    }
    if (!config.prefix || config.prefix == "") {
        console.log(__filename + "      | ERR: Missing prefix.");
        process.exit(1);
    }
    if (!config.encryptionIv) {
        console.error("CRITICAL: Initialization vector is missing.\nPlease open your configuration and set the initialization vector to anything you want.\nIf you want it to be random, use this:");
        const {randomBytes} = require("crypto");
        console.error(randomBytes(8).toString("hex"));
        process.exit(1);
    }
    if (config.encryptionIv.length > 16) {
        console.error("CRITICAL: Initialization vector is too long. It must be smaller than 16 bytes.");
        process.exit(1);
    }
    return;
};