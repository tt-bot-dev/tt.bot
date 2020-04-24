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
const Command = require("../lib/commandTypes/OwnerCommand");
const { STOP_REASONS } = require("sosamba/lib/Constants");

class ExitCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: "exit",
            description: "Kills the bot, shutting down all reaction menus and message listeners gracefully."
        });
    }
    async run(ctx) {
        this.sosamba.reactionMenus.forEach(menu => {
            this.sosamba.reactionMenus.remove(menu);
            menu.stopCallback(STOP_REASONS.SHUTDOWN);
        });
        this.sosamba.messageListeners.clear();
        this.sosamba.disconnect({
            reconnect: false
        });
        await ctx.send(":wave:");
        process.exit(0);
    }
}

module.exports = ExitCommand;