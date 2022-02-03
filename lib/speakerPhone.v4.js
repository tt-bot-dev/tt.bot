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
const { MessageListener } = require("sosamba");
const config = require("../config");
const PHONE = "\u260e";

class PhoneMessageListener extends MessageListener {
    channels = new Map();

    async die(meta) {
        meta.caller.createMessage("You have hung up.");
        meta.otherSide.createMessage("The other side has hung up.");
        this.channels.delete(meta.otherSide.id);
        this.channels.delete(meta.caller.id);
    }

    async run(ctx) {
        const channel = this.channels.get(ctx.channel.id);

        if (ctx.msg.content.startsWith(`${config.prefix}hangup`)) {
            this.die(channel);
            return;
        } else {
            const content = ctx.msg.content.slice(1);
            if (content || ctx.msg.attachments.length !== 0) {
                channel.otherSide.createMessage({
                    content: `${PHONE} ${this.sosamba.getTag(ctx.author)}: ${content || ""}\n${
                        ctx.msg.attachments.length !== 0 ? ctx.msg.attachments.map(a => a.url).join("\n") : ""
                    }`,
                    allowedMentions: {}
                });
            }
        }
    }


    addChannels(caller, otherSide, callData, otherSideCallData) {
        this.channels.set(caller.id, {
            otherSide,
            caller,
            callData,
            otherSideCallData
        });
        this.channels.set(otherSide.id, {
            otherSide: caller,
            caller: otherSide,
            callData: otherSideCallData,
            otherSideCallData: callData
        });

        caller.createMessage({
            content: `${PHONE} Connected to ${otherSideCallData.id} ${
                !otherSideCallData.private ?
                    `(#${otherSide.name} at ${otherSide.guild.name})`
                    : ""}\n\nPrefix your messages with \`^\` to send them over.\nType \`${config.prefix}hangup\` to hang up`,
            allowedMentions: {}
        });

        otherSide.createMessage({
            content: `${PHONE} Connected to ${callData.id} ${
                !callData.private ?
                    `(#${caller.name} at ${caller.guild.name})`
                    : ""}\n\nPrefix your messages with \`^\` to send them over.\nType \`${config.prefix}hangup\` to hang up`,
            allowedMentions: {}
        });
    }

    async prerequisites(ctx) {
        return this.channels.has(ctx.channel.id)
            && (ctx.msg.content.startsWith("^")
                || ctx.msg.content.startsWith(`${config.prefix}hangup`));
    }
}

module.exports = PhoneMessageListener;