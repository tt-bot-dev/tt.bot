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
const Command = require("../lib/commandTypes/OwnerCommand");
const { SerializedArgumentParser, ParsingError } = require("sosamba");
const { ExtensionFlags } = require("../lib/extensions/API/Constants");

class AllowExtFlagCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "allowextflag",
            description: "Allows an extension to use a privileged flag",
            argParser: new SerializedArgumentParser(sosamba, {
                args: [{
                    name: "extension",
                    type: async (val, ctx) => {
                        const ext = await ctx.db.getGuildExtension(val);
                        if (!ext) throw new ParsingError("Invalid extension");
                        return ext;
                    },
                    description: "The extension to grant the flags to"
                }, {
                    name: "flags",
                    type: val => {
                        if (!Object.prototype.hasOwnProperty.call(ExtensionFlags, val)) throw new ParsingError("Invalid extension flag");
                        return ExtensionFlags[val];
                    },
                    restSplit: true,
                    description: "The flags to grant"
                }]
            })
        });
    }

    async run(ctx, [extension, ...flags]) {
        for (const flag of flags) {
            extension.flags |= flag;
            extension.privilegedFlags &= ~flag;
        }

        await ctx.db.updateGuildExtension(extension.id, {
            flags: extension.flags,
            privilegedFlags: extension.privilegedFlags
        });
        await ctx.send(`:ok_hand: Allowed the flags to ${extension.name}`);
    }
}

module.exports = AllowExtFlagCommand;