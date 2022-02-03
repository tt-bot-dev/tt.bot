/**
 * Copyright (C) 2021 tt.bot dev team
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
const luxon = require("luxon");
const config = require("../config");

class InfoCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: "info",
            description: "Shows the information about the bot and its owners.",
            aliases: ["about"]
        });
    }

    async run(ctx) {
        const ownerStrings = Array.isArray(config.ownerID) ? 
            config.ownerID.map(i => this.getOwnerInfo(i, this.sosamba.users.get(i))) : 
            [this.getOwnerInfo(config.ownerID, this.sosamba.users.get(config.ownerID))];
        await ctx.send({
            embeds: [{
                author: {
                    name: this.sosamba.user.username,
                    icon_url: this.sosamba.user.staticAvatarURL
                }, 
                fields: [{
                    name: await ctx.t("INFO_STATS"),
                    value: await ctx.t("INFO_STATS_TEXT", {
                        guilds: this.sosamba.guilds.size,
                        users: this.sosamba.users.size,
                        channels: Object.keys(this.sosamba.channelGuildMap).length
                    }),
                    inline: true
                }, {
                    name: await ctx.t("INFO_AUTHORS"),
                    value: await ctx.t("INFO_OWNERS", {
                        owners: ownerStrings.join("\n")
                    }),
                    inline: true
                }, {
                    name: await ctx.t("INFO_VERSIONS"),
                    value: `tt.bot: ${require("../package.json").version}\nSosamba: ${require("sosamba/package.json").version}\nEris: ${require("../node_modules/eris/package.json").version}\nNode.js: ${process.versions.node}\nV8: ${process.versions.v8}`,
                    inline: true
                },
                {
                    name: await ctx.t("INFO_UPTIME"),
                    value: await this.getUptime(ctx),
                    inline: true
                },
                {
                    name: await ctx.t("INFO_FREE_SOFTWARE"),
                    value: await ctx.t("INFO_FREE_SOFTWARE_DESCRIPTION", {
                        learnMore: config.webserver.display("/license")
                    })
                }],
                color: 0x008800
            }]
        });
    }

    getOwnerInfo(id, owner) {
        return `<@${id}> (${owner ? `${owner.username}#${owner.discriminator}` : "unknown to me :("})`;
    }

    getUptime(ctx) {
        const diff = luxon.DateTime.utc().diff(luxon.DateTime.fromMillis(this.sosamba.readyTime), [
            "days",
            "hours",
            "minutes",
            "seconds"
        ]);

        return this._formatDiff(ctx, diff);
    }

    async _formatDiff(ctx, diff) {
        const userLanguage = await ctx.userLanguage;

        const commonOptions = {
            style: "unit",
            unitDisplay: "long"
        };

        const dayFormatter = new Intl.NumberFormat(userLanguage, {
            ...commonOptions,
            unit: "day"
        });
        const hourFormatter = new Intl.NumberFormat(userLanguage, {
            ...commonOptions,
            unit: "hour"
        });
        const minuteFormatter = new Intl.NumberFormat(userLanguage, {
            ...commonOptions,
            unit: "minute"
        });
        const secondFormatter = new Intl.NumberFormat(userLanguage, {
            ...commonOptions,
            unit: "second"
        });

        return `${diff.days > 0 ? `${dayFormatter.format(diff.days)}, ` : ""}${diff.hours > 0 ? `${hourFormatter.format(diff.hours)}, ` : ""}${minuteFormatter.format(diff.minutes)}, ${secondFormatter.format(Math.floor(diff.seconds))}`;
    }
}

module.exports = InfoCommand;
