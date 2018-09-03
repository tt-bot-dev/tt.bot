// A huge wall of code describing much secure sandbox

const User = require("./API/User");
const Message = require("./API/Message");
const Guild = require("./API/Guild");
const GuildAuditLogEntry = require("./API/GuildAuditLogEntry");
const Channel = require("./API/Channel");
const Invite = require("./API/Invite");
const Member = require("./API/Member");
const Role = require("./API/Role");
const TextChannel = require("./API/TextChannel")
const Constants = require("./API/Constants");

module.exports = (msg, bot) => {

    class Bot {
        constructor() {
            this.user = new User(bot.user);
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
        message: new Message(msg),
        guild: new Guild(msg.guild),
        channel: new TextChannel(msg.channel),
        member: new Member(msg.member),
        author: new User(msg.author),
        Constants,
        Types: {
            User, Message, Guild, GuildAuditLogEntry, Channel, Invite, Member, Role, TextChannel
        }
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