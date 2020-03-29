"use strict";
// A huge wall of code describing much secure sandbox

const Extension = require("./API/Extension");
const Guild = require("./API/Guild");
const Member = require("./API/Member");
const Message = require("./API/Message");
const TextChannel = require("./API/TextChannel");
const User = require("./API/User");
const Constants = require("./API/Constants");
const ResolveUserID = require("./Utils/ResolveUserID");
const ResolveChannelID = require("./Utils/ResolveChannelID");

module.exports = (ctx, bot, { id, name, data, flags }, { prefix, trigger, args }) => {
    const extStruct = new (Extension(ctx.db))(id, name, data, flags);
    class Bot {
        constructor(extStruct) {
            this.user = new User(extStruct, bot.user);
        }

        get guilds() {
            return bot.guilds.size;
        }

        get users() {
            return bot.users.size;
        }

        passesRoleHierarchy(member1, member2) {
            return bot.passesRoleHierarchy(member1, member2);
        }

        async waitForMessage(channel, author, check, timeout) {
            channel = ResolveChannelID(channel);
            author = ResolveUserID(author);
            if (!check) check = () => true;
            const ctx = await bot.messageAwaiter.waitForMessage({channel: {
                id: channel
            }, author: {
                id: author
            }}, ctx => {
                return check(new Message(extStruct, ctx.msg));
            }, timeout);
            return new Message(ctx.msg);
        }
    }
    const instance = {
        bot: new Bot(extStruct),
        guild: new Guild(extStruct, ctx.guild),
        message: new Message(extStruct, ctx.msg),
        channel: new TextChannel(extStruct, ctx.channel),
        member: new Member(extStruct, ctx.member),
        author: new User(extStruct, ctx.author),
        extension: extStruct,
        Constants,
        command: {
            prefix, trigger, args
        },
    };

    const box = {
        require(mod) {
            if (mod === "tt.bot") return instance;
            else if (mod === "chainfetch" && flags & 1) return require("chainfetch");
            else if (mod === "node-fetch" && flags & 1) return require("node-fetch");
            else throw new Error(`Cannot find module "${mod}". Are you sure that you have correct extension flag to use it?`);
        },
        setTimeout,
        clearTimeout
    };
    if (flags & 1) box.fetch = require("node-fetch"); // WHATWG fetch support
    else box.fetch = () => {
        throw new Error("Insufficient permissions to use fetch(). Are you sure that you have correct extension flag to use it?");
    };
    return box;
};