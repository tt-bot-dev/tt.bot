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

import { Command } from "sosamba";
import { getGuildConfig, t } from "../lib/util.mjs";

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
        if (!memberRole || !agreeChannel) {
            await ctx.send({
                embeds: [{
                    title: ":x: Cannot add the member role",
                    description: "The bot is misconfigured – the member role and/or the agreement channel are not set.",
                    footer: {
                        text: "Please contact the server's admins to reconfigure me.",
                    },
                    color: 0xFF0000,
                }],

                flags: 64,
            });

            return;
        }
        if (ctx.channel.id !== agreeChannel) {
            await ctx.send({
                embeds: [{
                    title: ":x: This command cannot be run in this channel",
                    description: "Switch to the appropriate channel and run the command again.",
                    color: 0xFF0000,
                }],

                flags: 64,
            });
        }
        if (!ctx.guild.roles.has(memberRole)) {
            await ctx.send({
                embeds: [{
                    title: ":x: Cannot add the member role",
                    description: "The member role does not exist.",
                    footer: {
                        text: "Please contact the server's admins to reconfigure me.",
                    },
                    color: 0xFF0000,
                }],

                flags: 64,
            });

            return;
        }
        if (ctx.member.roles.includes(memberRole)) {
            await ctx.send({
                embeds: [{
                    title: ":x: Cannot add the member role",
                    description: "You already have the member role!",
                    color: 0xFF0000,
                }],

                flags: 64,
            });

            return;
        }
        try {
            if (!ctx.guild.members.get(this.sosamba.user.id).permissions.has("manageRoles")) throw new Error();
            await ctx.member.addRole(memberRole, "Agreement to server's rules");

            await ctx.send({
                content: "Welcome to the server!",
                flags: 64,
            });
        } catch {
            const agreeFaultMessage = await t(ctx, "AGREE_FAULT", {
                serverOwner: this.sosamba.getTag(ctx.guild.members.get(ctx.guild.ownerID) ||
                    (await this.sosamba.memberRequester.request(ctx.guild, [ctx.guild.ownerID]))[0]),
            });

            await ctx.send({
                content: agreeFaultMessage,
                flags: 64,
            });
        }
    }
}

export default AgreeCommand;
