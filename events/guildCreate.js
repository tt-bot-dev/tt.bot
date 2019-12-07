const { Event } = require("sosamba");
const { serverLogChannel } = require("../config");
const dm = require("../util/sendReplyToDMs");
const UserProfile = require("../lib/Structures/UserProfile");

class GuildJoinEvent extends Event {
    constructor(...args) {
        super(...args, {
            name: "guildCreate"
        });
    }

    async run(guild) {
        const blacklist = [];
        if (this.sosamba.botCollectionServers.includes(guild)
        || blacklist.find(entry => entry.id === guild.id || entry.ownerID === guild.ownerID)) {
            await guild.leave();
            return;
        }
        try {
            await dm(guild.members.get(guild.ownerID), await this.getWelcomeMessage(guild.ownerID));
        }
        catch { }
        await this.sosamba.createMessage(serverLogChannel, {
            embed: {
                author: {
                    name: `I was added into ${guild.name} (${guild.id})`,
                    icon_url: guild.iconURL
                },
                color: 0x008800
            }
        })
    }

    async getWelcomeMessage(owner) {
        const profileEntry = await this.sosamba.db.getUserProfile(owner);
        let lang = "en";
        if (profileEntry) {
            const profile = new UserProfile(profileEntry);
            lang = profile.locale || "en";
        }

        return {
            embed: {
                title: await this.sosamba.i18n.getTranslation("HI_I_AM_BOT", lang),
                description: await this.sosamba.i18n.getTranslation("SOME_THINGS_SAID", lang),
                fields: [{
                    name: await this.sosamba.i18n.getTranslation("GETTING_STARTED", lang),
                    value: await this.sosamba.i18n.getTranslation("GETTING_STARTED_DESCRIPTION", lang)
                }, {
                    name: await this.sosamba.i18n.getTranslation("EVERYTHING_ELSE", lang),
                    value: await this.sosamba.i18n.getTranslation("EVERYTHING_ELSE_DESCRIPTION", lang)
                }, {
                    name: await this.sosamba.i18n.getTranslation("THANKS_FOR_CHOOSING", lang),
                    value: await this.sosamba.i18n.getTranslation("WISHING_GOOD_LUCK", lang)
                }],
                color: 0x008800
            }
        };
    }
}

module.exports = GuildJoinEvent;