const UserProfile = require("./Structures/UserProfile");
module.exports = function () {
    const config = global.config = require("../config");
    const { token, connectionOpts } = config;
    const db = require("rethinkdbdash")(connectionOpts);
    if (typeof config.webserverDisplay !== "function") {
        const oldDisplay = config.webserverDisplay;
        config.webserverDisplay = url => `${oldDisplay}${url}`;
    }
    const { Structures } = require("sosamba");
    const {encrypt, decrypt} = require("./dataEncryption");
    const Client = require("./Client");
    const bot = global.bot = new Client(token, {
        getAllUsers: true,
        defaultImageSize: 1024,
        defaultImageFormat: "webp",
        compress: true,
        disableEvents: {
            TYPING_START: true
        }
    });
    Structures.extend("Context", Context => class TTBotContext extends Context {
        constructor(...args) {
            super(...args);
            this.db = db;
        }

        get guildConfig() {
            return (async () => {
                if (this._guildConfig) return this._guildConfig;
                return this._guildConfig = await db.table("configs").get(this.guild.id);
            })();
        }

        set guildConfig(val) {
            return (async () => {
                if (typeof val !== "object") throw new TypeError("Not an object");
                this._guildConfig = val;
                await db.table("configs").get(this.guild.id).update(val);
                return val;
            })();
        }

        get userProfile() {
            return (async () => {
                if (this._userProfile) return this._userProfile;
                return this._userProfile = new UserProfile(await db.table("profile").get(this.author.id));
            });
        }

        set userProfile(val) {
            return (async () => {
                if (typeof val !== "object" && !(val instanceof UserProfile)) throw new TypeError("Not an object");
                this._userProfile = val;
                await db.table("profile").get(this.author.id).update(val.toEncryptedObject());
                return val;
            })();
        }
        encryptData(...args) {
            return encrypt(...args);
        }

        decryptData(...args) {
            return decrypt(...args);
        }
    });
    
    require("../util/overrideprops");
    global.isO = function(msg) {
        if (!Array.isArray(config.oid)) return msg.author.id === config.oid;
        else return config.oid.includes(msg.author.id);
    };
    bot.connect();
    require("../webserver/index")(db, bot, config);
    //require("./eventLoader")();
};