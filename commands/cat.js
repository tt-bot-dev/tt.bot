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
const { get } = require("chainfetch");

class CatCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: "cat",
            description: "Gets a random cat picture.",
            aliases: ["meow"]
        });
    }

    async run(ctx) {
        const { body } = await get("https://aws.random.cat/meow").toJSON();
        await ctx.send({
            embed: {
                image: {
                    url: body.file
                },
                color: 0x008800
            }
        });
    }
}

module.exports = CatCommand;
