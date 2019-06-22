"use strict";
const { SwitchArgumentParser } = require("sosamba");
const { user } = require("sosamba/lib/argParsers/switchSerializers/erisObjects");
const Command = require("../lib/ModCommand");
const BotSymbol = Symbol("tt.bot.clear.bots");
const { User } = require("eris");
// eslint cannot parse bigint literals :(
const D_EPOCH = BigInt(1421280000000);
const sleep = ms => new Promise(rs => setTimeout(rs, ms));

class ClearCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "clear",
            args: "<messages:Number> [contains:String] [mentions:User]",
            argParser: new SwitchArgumentParser(sosamba, {
                messages: {
                    type: Number,
                    default: 100,
                    description: "the number of messages to clean"
                },
                contains: {
                    type: String,
                    default: SwitchArgumentParser.None,
                    description: "an optional argument that filters the messages by content"
                },
                mentions: {
                    type: User,
                    default: SwitchArgumentParser.None,
                    description: "an optional argument that filters the messages by mentions"
                },
                from: {
                    type: async (val, ctx) => {
                        if (val === "bots") return BotSymbol;
                        else return user(val, ctx);
                    },
                    default: SwitchArgumentParser.None,
                    description: "an optional argument that filters the messages by their author - use `bots` in order to specify bots as an author."
                },
                invert: {
                    type: Boolean,
                    default: false,
                    description: "determines whether all above settings should be inverted."
                }
            }),
            description: "Clears the desired number of messages."
        });
    }
    async clearMessages(ctx, r) {
        const p = [ctx.msg.delete()];
        if (r.context) p.push(r.context.msg.delete());
        await Promise.all(p);
        return true;
    }
    async run(ctx, {messages, contains, mentions, from, invert}) {
        if (!ctx.channel.permissionsOf(ctx.sosamba.user.id).has("manageMessages")) return ctx.send(ctx.t("MISSING_PERMISSIONS"));
        const m = await ctx.send(ctx.t("CLEAR_CONFIRM"));
        const r = await ctx.askYesNo(true);
        if (!r.response) {
            await ctx.send(ctx.t("OP_CANCELLED"));
            setTimeout(this.clearMessages, 2000, ctx, r);
            return;
        }
        await this.clearMessages(ctx, r);
        const oldestPossibleSnowflake = (BigInt(Date.now()) - D_EPOCH) << BigInt(22);
        const msgs = await ctx.channel.getMessages(messages > 1000 ? 1000 : messages);
        const toDelete = msgs.filter(msg => {
            const v = this.matchesCriteriaContaining(msg, contains) && this.matchesCriteriaFrom(msg, from) && this.matchesCriteriaMentions(msg, mentions);
            return invert ? !v : v;
        }).map(msg => msg.id)
            .filter(msg => msg > oldestPossibleSnowflake);
        await this.deleteStrategy(ctx.channel, toDelete);
        
        const msgOK = await ctx.send(ctx.t("CLEAR_DONE", toDelete.length));
        setTimeout(async () => await msgOK.delete(), 2000);
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

    matchesCriteriaFrom(msg, from) {
        if (!from) return true;
        if (from === BotSymbol && msg.author.bot) return true;
        if (from && msg.author.id == from.id) return true;
        else return false;
    }

    async deleteStrategy(channel, messages) {
        if (messages.length === 1) {
            return await channel.deleteMessage(messages[0]);
        } else if (messages.length > 1 && messages.length <= 100) {
            return await channel.deleteMessages(messages);
        } else {
            // More than 100 messages, huh?
            const messageCopy = [...messages];
            const delet = async () => {
                if (messageCopy.length >= 100) {
                    const toDelet = messageCopy.splice(0, 100);
                    await channel.deleteMessages(toDelet);
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

module.exports = ClearCommand;