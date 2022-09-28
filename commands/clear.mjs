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
import { t } from "../lib/util.mjs";

const { Constants: { ApplicationCommandOptionTypes } } = Eris;
const D_EPOCH = 1421280000000n;
const sleep = ms => new Promise(rs => setTimeout(rs, ms));

class ClearCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "clear",
            description: "Clears the desired number of messages.",
            guildOnly: true,
            args: [{
                name: "messages",
                description: "The amount of messages to fetch for clearing. Limited to 1000.",
                type: ApplicationCommandOptionTypes.INTEGER,
                required: true,
            }, {
                name: "mentions",
                description: "Filters messages which mention this user.",
                type: ApplicationCommandOptionTypes.USER,
                required: false,
            }, {
                name: "from",
                description: "Filters messages created by this user.",
                type: ApplicationCommandOptionTypes.USER,
                required: false,
            }, {
                name: "invert",
                description: "Inverts preceeding settings.",
                type: ApplicationCommandOptionTypes.BOOLEAN,
                required: false,
            }],
        });
    }

    async permissionCheck(ctx) {
        return ctx.member.permissions.has("manageMessages") || await super.permissionCheck(ctx);
    }


    async clearMessages(ctx, r) {
        const p = [ctx.msg.delete()];
        if (r.context) p.push(r.context.msg.delete());
        await Promise.all(p);
        return true;
    }

    async run(ctx, { messages, mentions, from, invert }) {
        if (!this.sosamba.hasBotPermission(ctx.channel, "manageMessages")) {
            await ctx.send(await t(ctx, "MISSING_PERMISSIONS"));
            return;
        }
        await ctx.send({
            content: await t(ctx, "CLEAR_CONFIRM"),
            components: ctx.createYesNoButtons(),
        });
        const r = await ctx.askYesNo(true);
        if (!r.response) {
            await ctx.send(await t(ctx, "OP_CANCELLED"));
            setTimeout(() => this.clearMessages(ctx, r), 2000);
            return;
        }
        await this.clearMessages(ctx, r);
        const oldestPossibleSnowflake = BigInt(Date.now()) - D_EPOCH << BigInt(22);
        const msgs = await ctx.channel.getMessages(messages > 1000 ? 1000 : messages);
        const toDelete = msgs.filter(msg => {
            const v = this.matchesCriteriaFrom(msg, from) && this.matchesCriteriaMentions(msg, mentions);
            return invert ? !v : v;
        }).map(msg => msg.id)
            .filter(msg => msg > oldestPossibleSnowflake);
        await this.deleteStrategy(ctx.channel, toDelete);
        
        const msgOK = await ctx.send(await t(ctx, "CLEAR_DONE", {
            messages: toDelete.length,
        }));
        setTimeout(async () => await msgOK.delete(), 2000);
    }

    matchesCriteriaFrom(msg, author) {
        if (!author) return true;
        if (author && 
            msg.author.id === author.id) return true;
        else return false;
    }

    matchesCriteriaContaining(msg, contains) {
        if (!contains) return true;
        if (contains &&
            msg.content.toLowerCase().includes(contains.toLowerCase())) return true;
        else return false;
    }

    matchesCriteriaMentions(msg, mentions) {
        if (!mentions) return true;
        if (mentions && 
            msg.mentions.map(u => u.id).includes(mentions.id)) return true;
        else return false;
    }


    async deleteStrategy(channel, messages) {
        if (messages.length === 1) {
            return await channel.deleteMessage(messages[0]);
        } else if (messages.length > 1 && messages.length <= 100) {
            return await channel.deleteMessages(messages);
        } else {
            const messageCopy = [...messages];
            const delet = async () => {
                if (messageCopy.length >= 100) {
                    const toDelete = messageCopy.splice(0, 100);
                    await channel.deleteMessages(toDelete);
                    await sleep(1000);
                    return delet();
                } else {
                    await channel.deleteMessages(messageCopy);
                    return true;
                }
            };
    
            return delet();
        }
    }
}

export default ClearCommand;
