global.fs = require("fs");
global.queries = require("./queries");
global.userQuery = queries.user;
require("../util/checkConfig")();
require("./loadDiscord")();
if (typeof config.webserverDisplay !== "function") {
    const oldDisplay = config.webserverDisplay;
    config.webserverDisplay = url => `${oldDisplay}${url}`;
}
global.web = require("../webserver/index");
global.db = require("rethinkdbdash")(config.connectionOpts);
global.moment = require("moment");
global.momentTz = require("moment-timezone");
global.decimalToHex = function (d) {
    let hex = Number(d).toString(16);
    hex = hex.padStart(6, "0");
    return hex;
};
global.getUptime = function getUptime(moment1, moment2) {
    var diff = moment.duration(moment1.diff(moment2));
    var diffString = `${diff.days() > 0 ? diff.days() + " days, " : ""}${diff.hours() > 0 ? diff.hours() + " hours, " : ""}${diff.minutes()} minutes, and ${diff.seconds()} seconds`;
    return diffString;
};
const {encrypt, decrypt} = require("./dataEncryption");
global.encryptData = encrypt;
global.decryptData = decrypt;
const Sentry = require("../util/sentry");
const SentryClient = global.sentry = new Sentry();
SentryClient.enable();