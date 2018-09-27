// A huge wall of code describing much secure sandbox

const User = require("./API/User");
const Message = require("./API/Message");
const Guild = require("./API/Guild");
const Member = require("./API/Member");
const TextChannel = require("./API/TextChannel")
const Constants = require("./API/Constants");
const Extension = require("./API/Extension");
const ResolveUserID = require("./Utils/ResolveUserID");
const ResolveChannelID = require("./Utils/ResolveChannelID")

module.exports = (msg, bot, { id, name, data }, { prefix, trigger, args }) => {
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

        passesRoleHierarchy(member1, member2) {
            if (member1.guild != member2.guild) throw new TypeError("Members aren't in the same guild");
            if (member1.guild.ownerID == member1.id) return true;
            if (member1.roles.length == 0) return false;
            if (member2.roles.length == 0) return true;
            let member1Roles = member1.roles.sort((a, b) => b.position - a.position);
            let member2Roles = member2.roles.sort((a, b) => b.position - a.position);
            return member1Roles[0].position > member2Roles[0].position;
        }

        async waitForMessage(channel, author, check, timeout) {
            channel = ResolveChannelID(channel);
            author = ResolveUserID(author);
            if (!check) check = () => true;
            try {
                const [message] = await bot.waitForEvent("messageCreate", timeout, m => {
                    if (m.author.id !== author) return false;
                    if (m.channel.id !== channel) return false;
                    if (!check(new Message(m))) return false;
                    return true;
                })
                return new Message(message);
            } catch(err) {
                throw err
            }
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
        command: {
            prefix, trigger, args
        }
    }

    return {
        require(mod) {
            // Our bot
            if (mod === "tt.bot") return instance;
            // Snekfetch
            //else if (mod === "snekfetch") return require("snekfetch");
        },
        setTimeout,
        clearTimeout
    };
}