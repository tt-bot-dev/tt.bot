const eris = require("eris").Client;
const s = require("superagent")
class LibWUtil extends eris {
    constuctor(token, options) {
        //super(token,options);
    }
    getAuthorFromMessage(channelID, messageID) {
        let msg = this.getMessage(channelID, messageID);
        if (!msg.author) return; else return msg.author;
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
}
module.exports = LibWUtil