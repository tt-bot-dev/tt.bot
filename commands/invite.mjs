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
import { t } from "../lib/util.mjs";

class InviteCommand extends Command {
    constructor(...args) {
        super(...args, { 
            name: "invite",
            description: "Sends a link to invite me."
        });
    }

    async run(ctx) {
        await ctx.send(await t(ctx, "BOT_INVITE", {
            botInviteLink: "https://discord.com/oauth2/authorize?client_id=195506253806436353&scope=bot"
        }));
    }
}

export default InviteCommand;