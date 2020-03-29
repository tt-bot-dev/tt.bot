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
const { SwitchArgumentParser,
    Serializers: { Member } } = require("sosamba");
const Command = require("../lib/commandTypes/ModCommand");

class KickCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "kick",
            argParser: new SwitchArgumentParser(sosamba, {
                user: {
                    type: Member,
                    description: "The user to kick"
                },
                reason: {
                    type: String,
                    default: "No reason provided.",
                    description: "The reason for the kick"
                }
            }),
            description: "Kicks a user."
        });
    }

    async permissionCheck(ctx) {
        return ctx.member.permission.has("kickMembers") || await super.permissionCheck(ctx);
    }

    async run(ctx, { user, reason }) {
        if (this.sosamba.passesRoleHierarchy(ctx.member, user)) {
            if (!this.sosamba.hasBotPermission(ctx.channel, "kickMembers")) return ctx.send(await ctx.t("ERROR", "I don't have the permissions to kick the user."));
            await user.kick(`${this.sosamba.getTag(ctx.author)}: ${reason}`);
            this.sosamba.modLog.addKick(user.id, ctx.msg, reason);
            await ctx.send(await ctx.t("KICK_DONE", user));
        } else {
            await ctx.send(await ctx.t("ROLE_HIERARCHY_ERROR"));
        }
    }
}

module.exports = KickCommand;