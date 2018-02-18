const query = require("./query");
module.exports = {
    user: require("./queryUsers"),
    guild: require("./queryGuilds"),
    channel: require("./queryChannels"),
    role: (msg, quer, start) => {
        let q = new query(quer, msg.guild.roles, query => {
            return fn => {
                if (fn.id == query || `<@&${fn.id}>` == query || fn.name == query || fn.name.startsWith(query)) return true;
                else if (fn.name.toLowerCase() == query || fn.name.toLowerCase().startsWith(query)) return true;
                else return false;
            }
        }, r => {
            let str = `${r.name} (${r.id /*ar*/})`
            if (r.mentionable) str += ` (${r.mention})`
            return str
        });
        if (start) return q.start(msg);
        return q;
    }
};