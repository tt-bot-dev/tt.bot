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
const Command = require("../lib/commandTypes/AdminCommand");
const { announcementChannelID } = require("../config");

class UpdateFollowCommand extends Command {
    constructor(...args) {
        super(...args, {
            description: "Receive updates about tt.bot in this channel.",
            aliases: ["updates"],
            name: "botupdates"
        });
    }

    async permissionCheck(ctx) {
        return await super.permissionCheck(ctx) && ctx.channel.type === 0;
    }

    async run(ctx) {
        if (!ctx.sosamba.hasBotPermission(ctx.channel, "manageWebhooks")) {
            await ctx.send({
                embed: {
                    title: ":x: Missing Permissions",
                    description: "I need to be able to manage webhooks in this channel in order to set up bot updates. After that, you can feel free to remove it from me.",
                    color: 0xff0000,
                }
            });
            return;
        }

        await ctx.sosamba.followChannel(announcementChannelID, ctx.channel.id);
        await ctx.send(`:ok_hand: All the latest and greatest updates about ${ctx.sosamba.user.username} will be sent here.`);
    }
}

module.exports = UpdateFollowCommand;
