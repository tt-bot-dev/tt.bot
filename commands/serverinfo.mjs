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

import { Command } from "sosamba";
import util from "../lib/util.js";

const { t } = util;

class ServerCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: "serverinfo",
            description: "Shows the information about the server.",
            aliases: ["server"],
            guildOnly: true,
        });
    }

    async run(ctx) {
        const embed = {
            author: {
                name: ctx.guild.name
            },
            thumbnail: {
                url: ctx.guild.iconURL
            },
            fields: [{
                name: await t(ctx, "MEMBERS"),
                value: await t(ctx, "MEMBER_COUNT", {
                    members: ctx.guild.memberCount
                }),
            },
            {
                name: await t(ctx, "OWNER"),
                value: this.sosamba.getTag(ctx.guild.members.get(ctx.guild.ownerID) ||
                    (await this.sosamba.memberRequester.request(ctx.guild, [ctx.guild.ownerID]))[0]),
            }, {
                name: await t(ctx, "GUILD_VERIFICATION_LEVEL"),
                value: await this.getGuildVerification(ctx),
            }, {
                name: await t(ctx, "REQUIRES_ADMIN_MFA"),
                value: ctx.guild.mfaLevel === 1 ? await t(ctx, "YES") : await t(ctx, "NO"),
            }, {
                name: await t(ctx, "ROLES"),
                value: await t(ctx, "ROLE_COUNT", {
                    roles: ctx.guild.roles.size
                }),
            }, {
                name: await t(ctx, "EXPLICIT_FILTERING"),
                value: await this.getExplicitContent(ctx),
            }, {
                name: await t(ctx, "DEFAULT_NOTIFICATIONS"),
                value: ctx.guild.defaultNotifications === 1
                    ? await t(ctx, "ONLY_MENTIONS")
                    : await t(ctx, "ALL_MESSAGES"),
            },
            {
                name: await t(ctx, "FEATURES"),
                value: await (async () => {
                    let featureStr = "";
                    if (ctx.guild.features.includes("INVITE_SPLASH"))
                        featureStr += `:cityscape: ${await t(ctx, "ALLOWED_INVITE_SPLASH")}\n`;
                    if (ctx.guild.features.includes("VIP_REGIONS"))
                        featureStr += `:loud_sound: ${await t(ctx, "ALLOWED_VIP_REGIONS")}\n`;                    
                    if (ctx.guild.features.includes("VANITY_URL"))
                        featureStr += `:link: ${await t(ctx, "ALLOWED_VANITY_URL")}\n`;
                    if (ctx.guild.features.includes("VERIFIED"))
                        featureStr += `:white_check_mark: ${await t(ctx, "ALLOWED_VERIFIED")}\n`;
                    if (ctx.guild.features.includes("PARTNERED"))
                        featureStr += `:star: ${await t(ctx, "ALLOWED_PARTNERED")}\n`;
                    if (ctx.guild.features.includes("COMMERCE"))
                        featureStr += `:moneybag: ${await t(ctx, "ALLOWED_COMMERCE")}\n`;
                    if (ctx.guild.features.includes("NEWS"))
                        featureStr += `:newspaper: ${await t(ctx, "ALLOWED_NEWS")}\n`;
                    if (ctx.guild.features.includes("LURKABLE"))
                        featureStr += `:eyes: ${await t(ctx, "ALLOWED_LURKABLE")}\n`;
                    if (ctx.guild.features.includes("DISCOVERABLE"))
                        featureStr += `:mag: ${await t(ctx, "ALLOWED_DISCOVERABLE")}\n`;
                    if (ctx.guild.features.includes("FEATURABLE"))
                        featureStr += `:star2: ${await t(ctx, "ALLOWED_FEATURABLE")}\n`;
                    if (ctx.guild.features.includes("ANIMATED_ICON"))
                        featureStr += `:mountain: ${await t(ctx, "ALLOWED_ANIMATED_ICON")}\n`;
                    if (ctx.guild.features.includes("BANNER"))
                        featureStr += `:sunrise_over_mountains: ${await t(ctx, "ALLOWED_BANNER")}\n`;
                    return featureStr || await t(ctx, "NONE");
                })()
            }],
            description: `
**ID**: ${ctx.guild.id}
**${await t(ctx, "VOICE_REGION")}**: ${ctx.guild.region}
**${await t(ctx, "AFK_TIMEOUT")}**: ${await t(ctx, "AFK_MINUTES", {
    timeout: ctx.guild.afkTimeout / 60
})}
**Nitro Boosters**: ${ctx.guild.premiumSubscriptionCount} (Level ${ctx.guild.premiumTier})`,
            
            footer: {
                text: await t(ctx, "CREATED_ON")
            },
            timestamp: new Date(ctx.guild.createdAt),
            color: 0x008800
        };

        if (ctx.guild.splash) {
            embed.image = {
                url: `https://cdn.discordapp.com/splashes/${ctx.guild.id}/${ctx.guild.splash}.png?size=2048`
            };
        }
        await ctx.send({ embeds: [embed] });
    }

    async getGuildVerification(ctx) {
        switch (ctx.guild.verificationLevel) {
        case 0:
            return await t(ctx, "GUILD_VERIFICATION_NONE");

        case 1:
            return await t(ctx, "GUILD_VERIFICATION_LOW");

        case 2:
            return await t(ctx, "GUILD_VERIFICATION_MEDIUM");

        case 3:
            return await t(ctx, "GUILD_VERIFICATION_TABLEFLIP");

        case 4:
            return await t(ctx, "GUILD_VERIFICATION_ULTRATABLEFLIP");
        }
    }

    async getExplicitContent(ctx) {
        switch (ctx.guild.explicitContentFilter) {
        case 0:
            return await t(ctx, "EXPLICIT_FILTERING_OFF");

        case 1:
            return await t(ctx, "EXPLICIT_FILTERING_NOROLE");

        case 2:
            return await t(ctx, "EXPLICIT_FILTERING_ON");
        }
    }
}

export default ServerCommand;