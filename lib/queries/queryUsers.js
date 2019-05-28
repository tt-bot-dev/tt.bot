"use strict";
const qBase = require("./query");
module.exports = function (iQuery, msg, start) {
    let q = new qBase(iQuery, msg.guild.members, query => fn => {
        let nick = fn.nick ? fn.nick : fn.username;
        if (fn.username == query || fn.id == query || `<@${fn.id}>` == query || `<@!${fn.id}>` == query || `${fn.username}#${fn.discriminator}` == query || fn.username.startsWith(query)) return true;
        else if (nick.startsWith(query) || nick == query || `${nick}#${fn.discriminator}` == query) return true;
        else if (nick.toLowerCase().startsWith(query.toLowerCase()) || nick.toLowerCase() == query.toLowerCase() || `${nick.toLowerCase()}#${fn.discriminator}` == query.toLowerCase()) return true;
        else if (fn.username.toLowerCase() == query.toLowerCase() || fn.username.toLowerCase().startsWith(query.toLowerCase()) || `${fn.username.toLowerCase()}#${fn.discriminator}` == query.toLowerCase()) return true;
        else return false;
    }, bot.getTag);
    if (start) return q.start(msg);
    return q;
};