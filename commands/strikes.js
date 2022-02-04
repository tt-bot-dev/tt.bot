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
const { Command, Eris: { Constants: { ApplicationCommandOptionTypes } } } = require("sosamba");
const { t } = require("../lib/util");

class StrikeListCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "strikes",
            args: [{
                name: "user",
                description: "The user to ban.",
                type: ApplicationCommandOptionTypes.USER,
                required: true,
            }],
            description: "Gets user's strikes.",
            aliases: ["warns"],
            guildOnly: true,
        });
    }

    async run(ctx, [user]) {
        if (user.bot) {
            await ctx.send(await t(ctx, "BOTS_NOT_STRIKABLE"));
            return;
        }
        const strikes = await this.sosamba.modLog.getUserStrikes(user.id, ctx);
        if (strikes > 25) {
            const strikeStr = strikes.map(s => `${s.id} - ${s.reason}`);
            await ctx.send(await t(ctx, "TOO_MUCH_STRIKES"), {
                file: Buffer.from(strikeStr.join("\r\n")),
                name: "strikes.txt"
            });
        } else {
            await ctx.send({
                embeds: [{
                    author: {
                        name: await t(ctx, "STRIKE_OVERVIEW", {
                            user: this.sosamba.getTag(user)
                        })
                    },
                    fields: strikes.map(s => ({
                        name: `ID: ${s.id}`,
                        value: s.reason
                    }))
                }]
            });
        }
    }
}

module.exports = StrikeListCommand;