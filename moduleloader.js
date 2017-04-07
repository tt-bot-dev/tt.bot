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