const dm = require("../util/sendReplyToDMs");
const UserProfile = require("../Structures/UserProfile");

const translateToOwnersLang = async owner => {
    const prof = await db.table("profile").get(owner);
    let lang = "en";
    if (prof) {
        const struct = new UserProfile(prof);
        if (struct.locale) lang = struct.locale;
    }
    const msg = {
        t: (term, ...args) => 
            i18n.getTranslation(term, lang, ...args)
    };

    return {
        embed: {
            title: msg.t("HI_I_AM_BOT"),
            description: msg.t("SOME_THINGS_SAID"),
            fields: [{
                name: msg.t("GETTING_STARTED"),
                value: msg.t("GETTING_STARTED_DESCRIPTION")
            }, {
                name: msg.t("EVERYTHING_ELSE"),
                value: msg.t("EVERYTHING_ELSE_DESCRIPTION")
            }, {
                name: msg.t("THANKS_FOR_CHOOSING"),
                value: msg.t("WISHING_GOOD_LUCK")
            }],
            color: 0x008800
        }
    };
};


module.exports = async (guild) => {
    if (guild.defaultChannel) {
        try {
            dm(guild.members.get(guild.ownerID), await translateToOwnersLang(guild.ownerID));
        } catch(_) {
            // Do nothing. For now, give the people a little bit of lack of knowledge.
        }
    }
    bot.createMessage(config.serverLogChannel, {
        embed: {
            author: {
                name: `New server: ${guild.name} (${guild.id})`,
                icon_url: guild.iconURL
            },
            description: `Has ${guild.memberCount} members.`,
            footer: {
                text: `Owned by ${bot.users.get(guild.ownerID).username}#${bot.users.get(guild.ownerID).discriminator}`,
                icon_url: bot.users.get(guild.ownerID).staticAvatarURL
            }
        }
    });
    if (bot.listBotColls().includes(guild)) return guild.leave();
    let blacklist = await db.table("blacklist").run();
    if (blacklist.find(fn => {
        if (fn.id == guild.id) return true;
        if (fn.ownerID == guild.ownerID) return true;
    })) return guild.leave();
    bot.postStats().then(null, null);
    bot.postStats2().then(null, null);
};
module.exports.isEvent = true;
