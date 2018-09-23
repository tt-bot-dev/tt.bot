// A huge wall of code describing much secure sandbox

const User = require("./API/User");
const Message = require("./API/Message");
const Guild = require("./API/Guild");
const Member = require("./API/Member");
const TextChannel = require("./API/TextChannel")
const Constants = require("./API/Constants");
const Extension = require("./API/Extension");

module.exports = (msg, bot, {id, name, data}) => {
    const extStruct = new Extension(id, name, data);
    class Bot {
        constructor() {
            this.user = new User(extStruct, bot.user);
        }

        get guilds() {
            return bot.guilds.size;
        }

        get users() {
            return bot.users.size;
        }
    }

    const instance = {
        bot: new Bot(),
        message: new Message(extStruct, msg),
        guild: new Guild(extStruct, msg.guild),
        channel: new TextChannel(extStruct, msg.channel),
        member: new Member(extStruct, msg.member),
        author: new User(extStruct, msg.author),
        extension: extStruct,
        Constants,
    }

    return {
        require(mod) {
            // Our bot
            if (mod === "tt.bot") return instance;
            // Snekfetch
            else if (mod === "snekfetch") return require("snekfetch");
        },
        setTimeout,
        clearTimeout
    };
}