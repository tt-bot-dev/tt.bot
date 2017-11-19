const eris = require("eris").Client;
const s = require("superagent");
const ErisEndpoints = require("eris/lib/rest/Endpoints");
const ModLog = require("./modlog/index");
const _ModLog = new ModLog(); // js is a cunt
class LibWUtil extends eris {
    /*eslint-disable no-unused-vars*/
    constuctor(token, options) {
        //super(token,options);
    }
    get modLog() {
        return _ModLog;
    }

    async canUseCommand(user, command) {
        if (command.category == 4 && this.isAdmin(user)) return true;
        if (command.category == 3 && (await this.isModerator(user))) return true;
        if (command.category == 2 && isO(user)) return true;
        if (command.category == 1) return true;
        return false;
    }

    async _doPost(key = "", url = "", pld = { server_count: this.guilds.size }) {
        if (!key || !url || !pld) return;
        let data;
        try {
            data = await s.post(url)
                .set("Authorization", key)
                .send(pld);
        } catch (err) {
            throw {
                message: "Can't post, access text or body property for more info.",
                text: err.text,
                body: err.body
            };
        }
        if (data.statusCode != 200) throw {
            message: "Can't post, access text or body property for more info.",
            text: data.text,
            body: data.body
        };
        return;
    }
    passesRoleHierarchy(member1, member2) {
        if (member1.guild != member2.guild) throw new TypeError("Members aren't in the same guild");
        if (member1.guild.ownerID == member1.id) return true;
        if (member1.roles.length == 0) return false;
        if (member2.roles.length == 0) return true;
        let member1Roles = member1.roles.map(r => member1.guild.roles.get(r));
        let member2Roles = member2.roles.map(r => member2.guild.roles.get(r));
        member1Roles = member1Roles.sort((a, b) => b.position - a.position);
        member2Roles = member2Roles.sort((a, b) => b.position - a.position);
        return member1Roles[0].position > member2Roles[0].position;
    }
    async postStats() {
        if (!config.dbotskey || config.dbotskey == "") return;
        try {
            return await this._doPost(config.dbotskey, `https://bots.discord.pw/api/bots/${this.user.id}/stats`);
        } catch (err) {
            throw err;
        }

    }
    async postStats2() {
        if (!config.dbots2key || config.dbots2key == "") return;
        try {
            return await this._doPost(config.dbots2key, `https://discordbots.org/api/bots/${this.user.id}/stats`);
        } catch (err) {
            throw err;
        }
    }
    async isModerator(member) {
        if (this.isAdmin(member)) return true;
        let serverHasModRole = false;
        let modRole = null;
        let server = await db.table("configs").get(member.guild.id).run();
        if (server) {
            let role = member.guild.roles.find(r => r.name == server.modRole);
            if (role) { serverHasModRole = true; modRole = role; }
        } else {
            let role = member.guild.roles.find(r => r.name == "tt.bot mod");
            if (role) { serverHasModRole = true; modRole = role; }
        }
        if (serverHasModRole) return member.roles.includes(modRole.id);
    }

    isAdmin(member) {
        if (isO({ author: member.user })) return true;
        if (member.permission.json["administrator"]) return true;
        if (member.guild.ownerID == member.id) return true;
    }
    listBotColls() {
        return this.guilds.filter(g => ((g.members.filter(fn => fn.bot).length) / g.memberCount * 100) >= 75);
    }
    // eslint disable no-useless-escape
    escapeMarkdown(string) {
        let replacedItallicsAndBold = string.replace(/\*/g, "\\*");
        let replacedBackticks = replacedItallicsAndBold.replace(/\`/g, "\\`");
        let replacedUnderscores = replacedBackticks.replace(/\_/g, "\\_");
        let replacedBrackets = replacedUnderscores.replace(/\[/g, "\\[").replace(/\(/, "\\(").replace(/\]/g, "\\]").replace(/\)/g, "\\)");
        return replacedBrackets;
    }
    //actually Client.getRESTUser, but bypasses the need of options.restMode
    getUserWithoutRESTMode(userID) {
        return this.requestHandler.request("GET", ErisEndpoints.USER(userID), true).then((user) => new ErisO.User(user, this));
    }
    getBaseObject(id) {
        return new (require("eris/lib/structures/Base"))(id);
    }
    getTag(user) {
        return `${user.username}#${user.discriminator}`;
    }

    embedToText(embed) {
        let txt = [];
        if (embed.title) txt.push(`----------${embed.title} ${embed.url ? `- ${embed.url}` : ""}----------`);
        if (embed.author) txt.push(`${embed.title ? "(" : ""}${embed.author.name || "noname"} - ${embed.author.icon_url || "noiconuri"} - ${embed.author.url || "nouri"}${embed.title ? ")" : ""}`);
        if (embed.description) txt.push(embed.description);
        if (embed.fields) embed.fields.forEach(f => {
            txt.push("--------------------");
            txt.push(f.name);
            txt.push("");
            txt.push(f.value);
            txt.push("--------------------");
        });
        if (embed.thumbnail) txt.push("THUMB: " + embed.thumbnail.url);
        if (embed.image) txt.push(`IMAGE: ${embed.image.url}`);
        if (embed.video) txt.push(`VIDEO: ${embed.video.url}`);
        if (embed.provider) txt.push(`PROVIDER: ${embed.provider.name} ${embed.provider.url}`);
        if (embed.footer) txt.push(`----------${embed.footer.text || "notext"} - ${embed.footer.icon_url || "noiconuri"}----------`);
        return txt.join("\n");
    }
    parseMsg(string, m, g) {
        return string.replace(/{u\.mention}/g, `<@!${m.user.id}>`)
            .replace(/{g\.name}/g, g.name)
            .replace(/{g\.id}/g, g.id)
            .replace(/{u\.name}/g, m.user.username)
            .replace(/{u\.discrim}/g, m.user.discriminator)
            .replace(/{u\.id}/g, m.user.id);
    }
}
module.exports = LibWUtil;