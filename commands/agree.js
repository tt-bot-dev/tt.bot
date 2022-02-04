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

const { Command } = require("sosamba");
const { getGuildConfig, t } = require("../lib/util");

class AgreeCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: "agree",
            description: "If the server has set up the rule agreement feature, agrees to the server's rules.",
            guildOnly: true,
        });
    }
    async run(ctx) {
        // This should probably switch to something button-based
        const { memberRole, agreeChannel } = await getGuildConfig(ctx) || {};
        if (!memberRole || !agreeChannel) return;
        if (ctx.channel.id !== agreeChannel) return;
        if (!ctx.guild.roles.has(memberRole)) return;
        if (ctx.member.roles.includes(memberRole)) return;
        try {
            if (!ctx.guild.members.get(this.sosamba.user.id).permissions.has("manageRoles")) throw new Error();
            await ctx.member.addRole(memberRole, "Agreement to server's rules");

            await ctx.send({
                content: "Welcome to the server!",
                flags: 64
            });
        } catch {
            const agreeFaultMessage = await t(ctx, "AGREE_FAULT", {
                serverOwner: this.sosamba.getTag(ctx.guild.members.get(ctx.guild.ownerID) ||
                    (await this.sosamba.memberRequester.request(ctx.guild, [ctx.guild.ownerID]))[0])
            });

            await ctx.send({
                content: agreeFaultMessage,
                flags: 64
            });
        }
    }
}

module.exports = AgreeCommand;
