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
const { SwitchArgumentParser, Serializers: { User } } = require("sosamba");
const Command = require("../lib/commandTypes/ModCommand");
const BanCommand = require("./ban");

class SoftbanCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "softban",
            argParser: new SwitchArgumentParser(sosamba, {
                user: {
                    type: User,
                    description: "the user to softban"
                },
                reason: {
                    type: String,
                    default: "No reason provided.",
                    description: "the optional reason for the softban"
                }
            }),
            description: "Softbans a user."
        });
    }

    async permissionCheck(ctx) {
        return ctx.member.permission.has("banMembers") || await super.permissionCheck(ctx);
    }

    async run(ctx, {user, reason}) {
        await BanCommand.prototype.run.call(this, ctx, { user, reason, soft: true });
    }
}

module.exports = SoftbanCommand;