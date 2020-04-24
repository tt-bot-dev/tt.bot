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

const { Command } = require("sosamba");
const dmReply = require("../lib/util/sendReplyToDMs");

class AgreeCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: "agree",
            description: "If the server has set up the rule agreement feature, agrees to the server's rules.",
        });
    }
    async run(ctx) {
        const { memberRole, agreeChannel } = await ctx.guildConfig || {};
        if (!memberRole || !agreeChannel) return;
        if (ctx.channel.id !== agreeChannel) return;
        if (!ctx.guild.roles.has(memberRole)) return;
        if (ctx.member.roles.includes(memberRole)) return;
        try {
            await ctx.member.addRole(memberRole, "Agreement to server's rules");
        } catch {
            try {
                await dmReply(ctx.author, await ctx.t("AGREE_FAULT", ctx.guild.members.get(ctx.guild.ownerID)));
            } catch {
                const m = await ctx.send(`${ctx.author.mention} ${await ctx.t("AGREE_FAULT", ctx.guild.members.get(ctx.guild.ownerID))}`);
                setTimeout(() => m.delete(), 5000);
            }
        }
        try {
            await ctx.msg.delete();
        } catch {
            return;
        }
    }
}

module.exports = AgreeCommand;