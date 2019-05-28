"use strict";
const qBase = require("./query");
module.exports = function (iQuery, m) {
    let q = new qBase(iQuery, bot.guilds, query => fn => {
        // saving all users in an array where it finds these formats
        // username, id, mention (<@!id> or <@id>), nickname, username#1234 or nickname#1234 - case insensitive
        if (fn.name == query || fn.id == query || `<#${fn.id}>` == query || fn.name.startsWith(query)) return true;
        else if (fn.name.toLowerCase() == query.toLowerCase() || fn.name.toLowerCase().startsWith(query.toLowerCase())) return true;
        else return false; // we ignore other users
    }, (g) => `${g.name} (${g.id})`);
    if (m) return q.start(m);
    else return q;
};