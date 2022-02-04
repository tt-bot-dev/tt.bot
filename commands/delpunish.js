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
const Command = require("../lib/commandTypes/ModCommand");
const { Eris: { Constants: { ApplicationCommandOptionTypes } } } = require("sosamba");
const { version: sosambaVersion } = require("sosamba/package.json");

class RemoveStrikeCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "delpunish",
            args: [{
                name: "case_id",
                description: "The punishment to remove.",
                type: ApplicationCommandOptionTypes.STRING,
                required: true,
            }, {
                name: "reason",
                description: "The reason for removing this punishment.",
                type: ApplicationCommandOptionTypes.STRING,
                required: false,
            }], // "<caseID:String> [reason:String...]",
            /*argParser: new SimpleArgumentParser(sosamba, {
                separator: " "
            }),*/
            description: "Removes a strike from a user.",
            aliases: ["rmpunish"],
            guildOnly: true,
        });
    }

    async run(ctx, { case_id: caseID, reason }) {
        try {
            await this.sosamba.modLog.removeStrike(caseID, ctx, reason.join(" "));
        } catch(err) {
            await ctx.send(await ctx.t("CANNOT_UNSTRIKE", { error: err.toString() }));
            return;
        }
        await ctx.send(":ok_hand:");
    }
}

module.exports = RemoveStrikeCommand;
