const eris = require("eris").Client;
const s = require("superagent")
class LibWUtil extends eris {
    constuctor(token, options) {
        //super(token,options);
    }

    postStats() {
        if (!config.dbotskey || config.dbotskey == "") return
        return new Promise((rs, rj) => {
            s.post(`https://bots.discord.pw/api/bots/${this.user.id}/stats`)
                .set("Authorization", config.dbotskey)
                .send({ "server_count": this.guilds.size })
                .end((e, r) => {
                    if (e || r.statusCode != 200) rj({
                        message: "Can't post, access text or body property for more info.",
                        text: r.text,
                        body: r.body
                    })
                    else rs();
                })
        })
    }
    async isModerator(member) {
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
}
module.exports = LibWUtil