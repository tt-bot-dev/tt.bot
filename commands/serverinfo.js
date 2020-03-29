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
const { Command } = require("sosamba");

class ServerCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: "serverinfo",
            description: "Shows the information about the server.",
            aliases: ["server"]
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
                name: await ctx.t("MEMBERS"),
                value: await ctx.t("MEMBER_COUNT", ctx.guild.memberCount),
            },
            {
                name: await ctx.t("OWNER"),
                value: this.sosamba.getTag(ctx.guild.members.get(ctx.guild.ownerID)),
            }, {
                name: await ctx.t("GUILD_VERIFICATION_LEVEL"),
                value: await this.getGuildVerification(ctx),
            }, {
                name: await ctx.t("REQUIRES_ADMIN_MFA"),
                value: ctx.guild.mfaLevel === 1 ? await ctx.t("YES") : await ctx.t("NO"),
            }, {
                name: await ctx.t("ROLES"),
                value: await ctx.t("ROLE_COUNT", ctx.guild.roles.size),
            }, {
                name: await ctx.t("EXPLICIT_FILTERING"),
                value: await this.getExplicitContent(ctx),
            }, {
                name: await ctx.t("DEFAULT_NOTIFICATIONS"),
                value: ctx.guild.defaultNotifications === 1
                    ? await ctx.t("ONLY_MENTIONS")
                    : await ctx.t("ALL_MESSAGES"),
            },
            {
                name: await ctx.t("FEATURES"),
                value: await (async () => {
                    let featureStr = "";
                    if (ctx.guild.features.includes("INVITE_SPLASH"))
                        featureStr += `:cityscape: ${await ctx.t("ALLOWED_INVITE_SPLASH")}\n`;
                    if (ctx.guild.features.includes("VIP_REGIONS"))
                        featureStr += `:loud_sound: ${await ctx.t("ALLOWED_VIP_REGIONS")}\n`;
                    // Please, someone who has access to vanity URLs, if anything breaks, tell me
                    if (ctx.guild.features.includes("VANITY_URL"))
                        featureStr += `:link: ${await ctx.t("ALLOWED_VANITY_URL", ctx.guild.vanityURL)}\n`;
                    if (ctx.guild.features.includes("VERIFIED"))
                        featureStr += `:white_check_mark: ${await ctx.t("ALLOWED_VERIFIED")}\n`;
                    if (ctx.guild.features.includes("PARTNERED"))
                        featureStr += `:star: ${await ctx.t("ALLOWED_PARTNERED")}\n`;
                    if (ctx.guild.features.includes("COMMERCE"))
                        featureStr += `:moneybag: ${await ctx.t("ALLOWED_COMMERCE")}\n`;
                    if (ctx.guild.features.includes("NEWS"))
                        featureStr += `:newspaper: ${await ctx.t("ALLOWED_NEWS")}\n`;
                    if (ctx.guild.features.includes("LURKABLE"))
                        featureStr += `:eyes: ${await ctx.t("ALLOWED_LURKABLE")}\n`;
                    if (ctx.guild.features.includes("DISCOVERABLE"))
                        featureStr += `:mag: ${await ctx.t("ALLOWED_DISCOVERABLE")}\n`;
                    if (ctx.guild.features.includes("FEATURABLE"))
                        featureStr += `:star2: ${await ctx.t("ALLOWED_FEATURABLE")}\n`;
                    if (ctx.guild.features.includes("ANIMATED_ICON"))
                        featureStr += `:mountain: ${await ctx.t("ALLOWED_ANIMATED_ICON")}\n`;
                    if (ctx.guild.features.includes("BANNER"))
                        featureStr += `:sunrise_over_mountains: ${await ctx.t("ALLOWED_BANNER")}\n`;
                    return featureStr || await ctx.t("NONE");
                })()
            }],
            description: `
**ID**: ${ctx.guild.id}
**${await ctx.t("VOICE_REGION")}**: ${ctx.guild.region}
**${await ctx.t("AFK_TIMEOUT")}**: ${await ctx.t("AFK_MINUTES", ctx.guild.afkTimeout)}
**Nitro Boosters**: ${ctx.guild.premiumSubscriptionCount} (Level ${ctx.guild.premiumTier})`,
            
            footer: {
                text: await ctx.t("CREATED_ON")
            },
            timestamp: new Date(ctx.guild.createdAt),
            color: 0x008800
        };

        if (ctx.guild.splash) {
            embed["image"] = {
                url: `https://cdn.discordapp.com/splashes/${ctx.guild.id}/${ctx.guild.splash}.png?size=2048`
            };
        }
        await ctx.send({ embed });
    }

    async getGuildVerification(ctx) {
        switch (ctx.guild.verificationLevel) {
        case 0:
            return await ctx.t("GUILD_VERIFICATION_NONE");

        case 1:
            return await ctx.t("GUILD_VERIFICATION_LOW");

        case 2:
            return await ctx.t("GUILD_VERIFICATION_MEDIUM");

        case 3:
            return "(╯°□°）╯︵ ┻━┻" + await ctx.t("GUILD_VERIFICATION_TABLEFLIP");

        case 4:
            return "┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻ " + await ctx.t("GUILD_VERIFICATION_ULTRATABLEFLIP");
        }
    }

    async getExplicitContent(ctx) {
        switch (ctx.guild.explicitContentFilter) {
        case 0:
            return await ctx.t("EXPLICIT_FILTERING_OFF");

        case 1:
            return await ctx.t("EXPLICIT_FILTERING_NOROLE");

        case 2:
            return await ctx.t("EXPLICIT_FILTERING_ON");
        }
    }
}

module.exports = ServerCommand;
