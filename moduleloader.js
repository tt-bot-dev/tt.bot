global.fs = require("fs")
global.speakerPhoneBinds = require("./speakerphonemodule");
global.queries  = require("./queries/index")
global.userQuery = queries.user;
require("./checkConfig")();
require("./discord")()
require("./webserver/index")
global.db = require("rethinkdbdash")({
    db: "ttalpha"
});
global.keymetrics = require("./keymetrics/index.js");
global.moment = require("moment");
global.decimalToHex = function (d) {
  var hex = Number(d).toString(16);
  hex = "000000".substr(0, 6 - hex.length) + hex; 
  return hex;
}
global.translations = new (require("./translations/index"))()
global.format = require("util").format;
global.asyncStuff = new (require("./asyncstuff"))()