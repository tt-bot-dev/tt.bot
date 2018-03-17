const qBase = require("./query");
module.exports = function (iQuery, msg, start) {
    let q = new qBase(iQuery, msg.guild.channels, query => fn => {
        // saving all users in an array where it finds these formats
        // username, id, mention (<@!id> or <@id>), nickname, username#1234 or nickname#1234 - case insensitive
        if (fn.name == query || fn.id == query || `<#${fn.id}>` == query || fn.name.startsWith(query)) return true;
        else if (fn.name.toLowerCase() == query.toLowerCase() || fn.name.toLowerCase().startsWith(query.toLowerCase())) return true;
        else return false; // we ignore other users
    }, c => {
        let t = "";
        if (c.type == 2) t += "Voice channel";
        if (c.type == 4) t += "Category";
        let str = `${t? `${t} `: ""}${c.name} (${c.id})`;
        if (c.type == 0) str += ` (${c.mention})`;
        return str;
    });
    if (start) return q.start(msg);
    else return q;
};