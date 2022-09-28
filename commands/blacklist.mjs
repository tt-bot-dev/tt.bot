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

import Command from "../lib/commandTypes/OwnerCommand.mjs";
import config from "../config.js";
import { Eris } from "sosamba";

const { homeGuild } = config;
const { Constants: { ApplicationCommandOptionTypes } } = Eris;

class BlacklistManagerCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: "blacklist",
            description: "Manages blacklisted servers.",
            args: [
                {
                    name: "query",
                    description: "Queries the blacklist.",
                    type: ApplicationCommandOptionTypes.SUB_COMMAND,
                    options: [{
                        name: "id",
                        description: "The ID to look for",
                        type: ApplicationCommandOptionTypes.STRING,
                        required: true,
                    }],
                },
                {
                    name: "add",
                    description: "Blacklists a server.",
                    type: ApplicationCommandOptionTypes.SUB_COMMAND,
                    options: [{
                        name: "id",
                        description: "The ID of the server to blacklist",
                        type: ApplicationCommandOptionTypes.STRING,
                        required: true,
                    }, {
                        name: "reason",
                        description: "The reason for blacklisting the server.",
                        type: ApplicationCommandOptionTypes.STRING,
                        required: false,
                    }],
                },
                {
                    name: "remove",
                    description: "Removes a server from the blacklist.",
                    type: ApplicationCommandOptionTypes.SUB_COMMAND,
                    options: [{
                        name: "id",
                        description: "The ID of the server to remove from the blacklist.",
                        type: ApplicationCommandOptionTypes.STRING,
                        required: true,
                    }],
                },
            ],
            registerIn: homeGuild,
        });
    }

    async run(ctx, { id, reason }) {
        switch (ctx.subcommand) {
        case "query": {
            const guilds = await this.sosamba.db.getBlacklistedGuildById(id);
            if (guilds.length === 0) {
                return await ctx.send({
                    embeds: [{
                        title: ":x: Cannot find blacklisted guilds by these IDs.",
                        description: "It's not blacklisted. Check the ID and try again.",
                        color: 0xFF0000,
                    }],
                });
            }

            const fields = guilds.map(g => ({
                name: `${g.id} ${g.ownerID ? `(owned by ${g.ownerID})` : ""}`,
                value: g.reason || "no reason",
            }));

            await ctx.send({
                embeds: [{
                    title: "Here are the blacklisted guilds for this ID",
                    color: 0x008800,
                    fields: fields.slice(0, 25),
                }],
            });
            break;
        }
        case "add": {
            const guild = this.sosamba.guilds.get(id);
            const ownerID = guild?.ownerID;
            await this.sosamba.db.addBlacklistedGuild(id, ownerID, reason ?? "");
            await Promise.all(this.sosamba.guilds.filter(g => g.id === id || g.ownerID === ownerID)
                .map(g => {
                    g.__automaticallyLeft = true;
                    return g.leave();
                }));
            await ctx.send(":ok_hand:");
            break;
        }
        case "remove": {
            await this.sosamba.db.removeBlacklistedGuild(id);
            await ctx.send(":ok_hand:");
            break;
        }
        }
    }
}

export default BlacklistManagerCommand;
