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
const { Command } = require("sosamba");
const ExtensionRunner = require("./extensions/Runner");
const config = require("../config");
class ExtensionCommandWrapper extends Command {
    constructor(sosamba, extension) {
        super(sosamba, undefined, undefined, { name: "" });
        this.extension = extension;
    }

    async run(ctx, args) {
        const store = await ctx.db.getGuildExtensionStore(ctx.guild.id, this.extension.store);
        const { error } = await ExtensionRunner(ctx, this.sosamba, this.extension.code, {
            id: this.extension.id,
            name: this.extension.name,
            flags: this.extension.flags,
            data: store ?
                Object.assign({}, JSON.parse(store.store), {
                    id: store.id,
                    guildID: ctx.guild.id
                })
                : { guildID: ctx.guild.id, id: null }
        }, {
            prefix: await ctx.guildConfig && (await ctx.guildConfig).prefix || config.prefix,
            trigger: this.extension.commandTrigger,
            args
        });
        if (error) throw error;
    }
}

module.exports = ExtensionCommandWrapper;