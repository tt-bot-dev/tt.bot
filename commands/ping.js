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

"use strict";
const { Command } = require("sosamba");

class PingCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: "ping",
            description: "Shows my latency to Discord.",
            aliases: ["pong"]
        });
    }

    async run(ctx) {
        await ctx.interaction.defer();

        const m = await ctx.interaction.createFollowup(":ping_pong:");

        await ctx.interaction.editOriginalMessage({
            content: "",
            embeds: [{
                title: await ctx.t("PONG"),
                description: await ctx.t("PING_LATENCY", {
                    ms: m.timestamp - ctx.interaction.createdAt
                }),
                footer: {
                    text: await ctx.t("PING_DISCORD_LATENCY", {
                        ms: ctx.guild.shard.latency
                    })
                },
                color: 0x008800
            }]
        });
    }
}

module.exports = PingCommand;