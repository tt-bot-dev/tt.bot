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

import { Eris } from "sosamba";
import Command from "../lib/commandTypes/ModCommand.mjs";
import { PunishTypes } from "../lib/modlog/constants.mjs";
import { t } from "../lib/util.mjs";

const { Constants: { ApplicationCommandOptionTypes } } = Eris;

class BanCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: "ban",
            description: "Bans a user from this server.",
            guildOnly: true,
            args: [{
                name: "user",
                description: "The user to ban.",
                type: ApplicationCommandOptionTypes.USER,
                required: true,
            }, {
                name: "reason",
                description: "The reason for the ban",
                type: ApplicationCommandOptionTypes.STRING,
                required: false,
            }, {
                name: "soft",
                description: "Determines whether the user will be unbanned immediately after banning.",
                type: ApplicationCommandOptionTypes.BOOLEAN,
                required: false,
            }, {
                name: "days",
                description: "The amount of days worth of message history to purge.",
                type: ApplicationCommandOptionTypes.INTEGER,
                required: false,
            }],
        });
    }

    async permissionCheck(ctx) {
        return ctx.member.permissions.has("banMembers") || await super.permissionCheck(ctx);
    }

    async run(ctx, { user, reason, soft, days }) {
        const _reason = reason ?? "No reason provided.";
        const _soft = soft ?? false;
        const _days = days ?? 0;

        if (this.sosamba.passesRoleHierarchy(ctx.member, user)) {
            if (!ctx.guild.members.get(this.sosamba.user.id).permissions.has("banMembers") ||
                !this.sosamba.passesRoleHierarchy(ctx.guild.members.get(this.sosamba.user.id), user)) {
                await ctx.send({
                    content: await t(ctx, "MISSING_PERMISSIONS"),
                    flags: 64,
                });
                return;
            }
            await ctx.guild.banMember(user.id, _days, encodeURIComponent(`${this.sosamba.getTag(ctx.author)}: ${_reason}`));
            if (_soft) await ctx.guild.unbanMember(user.id);
            this.sosamba.modLog.createPunishment(ctx, _soft ? PunishTypes.SOFTBAN : PunishTypes.BAN, user.id, _reason).catch(() => void 0);
            await ctx.send(await t(ctx, `${_soft ? "SOFT" : ""}BAN_DONE`, {
                user: this.sosamba.getTag(user.user),
            }));
        } else {
            await ctx.send({
                content: await t(ctx, "ROLE_HIERARCHY_ERROR"),
                flags: 64,
            });
        }
    }
}

export default BanCommand;
