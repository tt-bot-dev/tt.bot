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
const { Event } = require("sosamba");
const { version: sosambaVersion } = require("sosamba/package.json");
const { version } = require("../package.json");

class CommandErrorEvent extends Event {
    constructor(...args) {
        super(...args, {
            name: "commandError"
        });
    }

    async run(e, ctx) {
        if (e.constructor.name !== "ExtensionError") this.log.error(e);
        try {
            await ctx.send({
                embed: {
                    title: ":x: Error running the command",
                    description: `I am unable to run the command because of a coding error:\n\`\`\`js\n${e.stack}\n\`\`\``,
                    color: 0xFF0000,
                    footer: {
                        text: `Please report this issue on our support server or on GitHub. | tt.bot v${version} running on Sosamba v${sosambaVersion}`
                    }
                }
            });
        } catch {}
    }
}

module.exports = CommandErrorEvent;