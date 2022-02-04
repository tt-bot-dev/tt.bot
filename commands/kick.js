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
const { Eris: { Constants: { ApplicationCommandOptionTypes } } } = require("sosamba");
const Command = require("../lib/commandTypes/ModCommand");
const { PunishTypes } = require("../lib/modlog/constants");
const { t } = require("../lib/util");

class KickCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "kick",
            args: [{
                name: "user",
                description: "The user to ban.",
                type: ApplicationCommandOptionTypes.USER,
                required: true,
            }, {
                name: "reason",
                description: "The reason for the ban",
                type: ApplicationCommandOptionTypes.STRING,
                required: false
            }],
            description: "Kicks a user.",
            guildOnly: true,
        });
    }

    async permissionCheck(ctx) {
        return ctx.member.permissions.has("kickMembers") || await super.permissionCheck(ctx);
    }

    async run(ctx, { user, reason }) {
        let _reason = reason ?? "No reason provided.";
        if (this.sosamba.passesRoleHierarchy(ctx.member, user)) {
            if (!this.sosamba.hasBotPermission(ctx.channel, "kickMembers") || !this.sosamba.passesRoleHierarchy(ctx.guild.members.get(this.sosamba.user.id), user)){
                await ctx.send(await t(ctx, "MISSING_PERMISSIONS"));
                return;
            }
            await user.kick(encodeURIComponent(`${this.sosamba.getTag(ctx.author)}: ${_reason}`));
            this.sosamba.modLog.createPunishment(ctx, PunishTypes.KICK, user.id, _reason);
            await ctx.send(await t(ctx, "KICK_DONE", {
                user: this.sosamba.getTag(user)
            }));
        } else {
            await ctx.send(await t(ctx, "ROLE_HIERARCHY_ERROR"));
        }
    }
}

module.exports = KickCommand;
