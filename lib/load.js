"use strict";
const UserProfile = require("./Structures/UserProfile");
require("moment-timezone");
const config = global.config = require("../config");
const { token, database } = config;
const { Structures } = require("sosamba");
const {encrypt, decrypt} = require("./dataEncryption");
const Client = require("./Client");
//const { Collection, Base } = require("eris");
module.exports = async function () {
    if (typeof config.webserverDisplay !== "function") {
        const oldDisplay = config.webserverDisplay;
        config.webserverDisplay = url => `${oldDisplay}${url}`;
    }
    const bot = global.bot = new Client(token, {
        getAllUsers: true,
        defaultImageSize: 1024,
        defaultImageFormat: "webp",
        compress: true,
        disableEvents: {
            TYPING_START: true
        },
        prefix: async ctx => {
            const prefixes = [config.prefix];
            const cfg = await ctx.guildConfig;
            if (cfg && cfg.prefix !== config.prefix) prefixes.push(cfg.prefix);
            return prefixes;
        }
    }, database);
    await bot.i18n.addLanguages(`${__dirname}/../languages`);
    Structures.extend("Context", Context => class TTBotContext extends Context {
        constructor(...args) {
            super(...args);
            this.db = this.sosamba.db;
        }

        get guildConfig() {
            return (async () => {
                if (this._guildConfig) return this._guildConfig;
                return this._guildConfig = await this.db.getGuildConfig(this.guild.id);
            })();
        }

        set guildConfig(val) {
            return (async () => {
                if (typeof val !== "object") throw new TypeError("Not an object");
                const cfg = await this.guildConfig || {};
                this._guildConfig = Object.assign(cfg, val);
                await this.db.updateGuildConfig(this.guild.id, val);
                return val;
            })();
        }

        get userProfile() {
            return (async () => {
                if (this._userProfile) return this._userProfile;
                return this._userProfile = new UserProfile((await this.db.getUserProfile(this.author.id)) || { id: this.author.id });
            })();
        }

        set userProfile(val) {
            return (async () => {
                if (typeof val !== "object" && !(val instanceof UserProfile)) throw new TypeError("Not an object");
                (await this.userProfile) || (this._userProfile = new UserProfile({
                    id: this.author.id
                }));
                this._userProfile = val;
                await this.db.updateUserProfile(this.author.id, val.toEncryptedObject());
                return val;
            })();
        }
        encryptData(...args) {
            return encrypt(...args);
        }

        decryptData(...args) {
            return decrypt(...args);
        }

        get userLanguage() {
            return this.userProfile.then(p => p.locale || "en");
        }
    });
    
    // Currently useless.
    //require("../util/overrideprops");
    global.isO = function(msg) {
        if (!Array.isArray(config.oid)) return msg.author.id === config.oid;
        else return config.oid.includes(msg.author.id);
    };
    bot.connect();
    require("../webserver/index")(bot.db.db, bot, config);
};