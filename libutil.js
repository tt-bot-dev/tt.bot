const eris = require("eris").Client;
const s = require("superagent")
const ErisEndpoints = require("eris/lib/rest/Endpoints")
class LibWUtil extends eris {
    constuctor(token, options) {
        //super(token,options);
    }

    async postStats() {
        if (!config.dbotskey || config.dbotskey == "") return
        let data;
        try {
            data = await s.post(`https://bots.discord.pw/api/bots/${this.user.id}/stats`)
                .set("Authorization", config.dbotskey)
                .send({ "server_count": this.guilds.size })
        } catch (err) {
            throw {
                message: "Can't post, access text or body property for more info.",
                text: r.text,
                body: r.body
            }
        }
        if (data.statusCode != 200) throw {
            message: "Can't post, access text or body property for more info.",
            text: r.text,
            body: r.body
        }
        return;

    }
    async isModerator(member) {
        if (isO({ author: member.user })) return true;
        if (member.permission.json["administrator"]) return true;
        if (member.guild.ownerID == member.id) return true;
        let serverHasModRole = false;
        let modRole = null;
        let server = await db.table("configs").get(member.guild.id).run()
        if (server) {
            let role = member.guild.roles.find(r => r.name == server.mRoleName);
            if (role) { serverHasModRole = true; modRole = role }
        } else {
            let role = member.guild.roles.find(r => r.name == "tt.bot mod");
            if (role) { serverHasModRole = true; modRole = role }
        }
        if (serverHasModRole) return member.roles.includes(modRole.id);
    }
    listBotColls() {
        return this.guilds.filter(g => ((g.members.filter(fn => fn.bot).length) / g.memberCount * 100) >= 75)
    }
    escapeMarkdown(string) {
        let replacedItallicsAndBold = string.replace(/\*/g, "\\*")
        let replacedBackticks = replacedItallicsAndBold.replace(/\`/g, "\\`");
        let replacedUnderscores = replacedBackticks.replace(/\_/g, "\\_");
        let replacedBrackets = replacedUnderscores.replace(/\[/g, "\\[").replace(/\(/, "\\(").replace(/\]/g, "\\]").replace(/\)/g, "\\)")
        return replacedBrackets
    }
    //actually Client.getRESTUser, but bypasses the need of options.restMode
    getUserWithoutRESTMode(userID) {
        return this.requestHandler.request("GET", ErisEndpoints.USER(userID), true).then((user) => new ErisO.User(user, this));
    }
    getBaseObject(id) {
        return new (require("eris/lib/structures/Base"))(id)
    }
    getTag(user) {
        return `${user.username}#${user.discriminator}`
    }
}
module.exports = LibWUtil