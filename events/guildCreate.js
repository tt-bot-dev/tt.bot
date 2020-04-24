/**
 * Copyright (C) 2020 tt.bot dev team
 * 
 * This file is part of tt.bot.
 * 
 * tt.bot is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * tt.bot is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with tt.bot.  If not, see <http://www.gnu.org/licenses/>.
 */

"use strict";
const { Event } = require("sosamba");
const { serverLogChannel } = require("../config");
const dm = require("../lib/util/sendReplyToDMs");
const UserProfile = require("../lib/Structures/UserProfile");

class GuildJoinEvent extends Event {
    constructor(...args) {
        super(...args, {
            name: "guildCreate"
        });
    }

    async run(guild) {
        const blacklist = await this.sosamba.db.getBlacklistedGuilds();
        if (this.sosamba.botCollectionServers.includes(guild)
        || blacklist.find(entry => entry.id === guild.id || entry.ownerID === guild.ownerID)) {
            guild.__automaticallyLeft = true;
            await guild.leave();
            return;
        }
        try {
            await dm(guild.members.get(guild.ownerID), await this.getWelcomeMessage(guild.ownerID));
        } catch { }
        await this.sosamba.createMessage(serverLogChannel, {
            embed: {
                author: {
                    name: `I was added into ${guild.name} (${guild.id})`,
                    icon_url: guild.iconURL
                },
                color: 0x008800
            }
        });
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
                    name: await this.sosamba.i18n.getTranslation("FREE_SOFTWARE", lang),
                    value: await this.sosamba.i18n.getTranslation("FREE_SOFTWARE_DESCRIPTION", lang)
                },
                {
                    name: await this.sosamba.i18n.getTranslation("THANKS_FOR_CHOOSING", lang),
                    value: await this.sosamba.i18n.getTranslation("WISHING_GOOD_LUCK", lang)
                }],
                color: 0x008800
            }
        };
    }
}

module.exports = GuildJoinEvent;