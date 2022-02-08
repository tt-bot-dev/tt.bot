/**
 * Copyright (C) 2022 tt.bot dev team
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

import { Event } from "sosamba";
import config from "../config.js";
import dm from "../lib/util/sendReplyToDMs.mjs";
import UserProfile from "../lib/Structures/UserProfile.mjs";

class GuildJoinEvent extends Event {
    constructor(...args) {
        super(...args, {
            name: "guildCreate"
        });
    }

    async run(guild) {
        const blacklist = await this.sosamba.db.getBlacklistedGuilds();
        // blacklisting bot collection servers with intents is too expensive
        if (/*this.sosamba.botCollectionServers.includes(guild)
        || */blacklist.find(entry => entry.id === guild.id || entry.ownerID === guild.ownerID)) {
            guild.__automaticallyLeft = true;
            await guild.leave();
            return;
        }
        try {
            await dm(guild.members.get(guild.ownerID) || (await this.sosamba.memberRequester.request(guild, [guild.ownerID]))[0],
                await this.getWelcomeMessage(guild.ownerID));
        } catch { }
        await this.sosamba.createMessage(config.serverLogChannel, {
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
                title: await this.sosamba.localeManager.translate(lang, "HI_I_AM_BOT"),
                description: await this.sosamba.localeManager.translate(lang, "SOME_THINGS_SAID", {
                    botName: this.sosamba.user.username
                }),
                fields: [{
                    name: await this.sosamba.localeManager.translate(lang, "GETTING_STARTED"),
                    value: await this.sosamba.localeManager.translate(lang, "GETTING_STARTED_DESCRIPTION", {
                        defaultPrefix: config.prefix
                    })
                }, {
                    name: await this.sosamba.localeManager.translate(lang, "EVERYTHING_ELSE"),
                    value: await this.sosamba.localeManager.translate(lang, "EVERYTHING_ELSE_DESCRIPTION", {
                        defaultPrefix: config.prefix
                    })
                }, {
                    name: await this.sosamba.localeManager.translate(lang, "FREE_SOFTWARE"),
                    value: await this.sosamba.localeManager.translate(lang, "FREE_SOFTWARE_DESCRIPTION")
                },
                {
                    name: await this.sosamba.localeManager.translate(lang, "WELCOME_UPDATES"),
                    value: await this.sosamba.localeManager.translate(lang, "WELCOME_UPDATES_DESCRIPTION", {
                        defaultPrefix: config.prefix
                    })
                },
                {
                    name: await this.sosamba.localeManager.translate(lang, "WELCOME_PRIVACY_POLICY"),
                    value: await this.sosamba.localeManager.translate(lang, "WELCOME_PRIVACY_POLICY_DESCRIPTION"),
                },
                {
                    name: await this.sosamba.localeManager.translate(lang, "THANKS_FOR_CHOOSING"),
                    value: await this.sosamba.localeManager.translate(lang, "WISHING_GOOD_LUCK")
                }],
                color: 0x008800
            }
        };
    }
}

export default GuildJoinEvent;
