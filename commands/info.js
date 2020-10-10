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
            embed: {
                author: {
                    name: this.sosamba.user.username,
                    icon_url: this.sosamba.user.staticAvatarURL
                }, 
                fields: [{
                    name: await ctx.t("INFO_STATS"),
                    value: await ctx.t("INFO_STATS_TEXT"),
                    inline: true
                }, {
                    name: await ctx.t("INFO_AUTHORS"),
                    value: await ctx.t("INFO_OWNERS", ownerStrings),
                    inline: true
                }, {
                    name: await ctx.t("INFO_DONATE"),
                    value: "https://ko-fi.com/tttie",
                    inline: true
                }, {
                    name: await ctx.t("INFO_VERSIONS"),
                    value: `tt.bot: ${require("../package.json").version}\nSosamba: ${require("sosamba/package.json").version}\nEris: ${require("../node_modules/eris/package.json").version}\nNode.js: ${process.versions.node}\nV8: ${process.versions.v8}\n[Privacy](https://tttie.cz/privacy/tt.bot.html)`,
                    inline: true
                },
                {
                    name: await ctx.t("INFO_UPTIME"),
                    value: this.getUptime(),
                    inline: true
                }],
                color: 0x008800
            }
        });
    }

    getOwnerInfo(id, owner) {
        return `<@${id}> (${owner ? owner.username + "#" + owner.discriminator : "unknown to me :("})`;
    }

    getUptime() {
        const diff = luxon.DateTime.utc().diff(luxon.DateTime.fromMillis(this.sosamba.readyTime), [
            "days",
            "hours",
            "minutes",
            "seconds"
        ]);

        return `${diff.days > 0 ? Math.floor(diff.days) + " days, " : ""}${diff.hours > 0 ? Math.floor(diff.hours) + " hours, " : ""}${Math.floor(diff.minutes)} minutes, and ${Math.floor(diff.seconds)} seconds`;
    }
}

module.exports = InfoCommand;
