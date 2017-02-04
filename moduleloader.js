global.fs = require("fs")
require("./db.js");
global.queries  = require("./queries/index")
global.userQuery = queries.user;
require("./checkConfig")();
require("./discord")()
require("./webserver/index")