"use strict";
const { Command, SwitchArgumentParser } = require("sosamba");
const { user } = require("sosamba/lib/argParsers/switchSerializers/erisObjects");
const BotSymbol = Symbol("tt.bot::Bots");
const { User } = require("eris");
const D_EPOCH = 1421280000000n;

class ClearCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "clear",
            args: "<messages:Number> [contains:String] [mentions:User]",
            argParser: new SwitchArgumentParser(sosamba, {
                messages: {
                    type: Number,
                    default: 100
                },
                contains: {
                    type: String,
                    default: SwitchArgumentParser.None
                },
                mentions: {
                    type: User,
                    default: SwitchArgumentParser.None
                },
                from: {
                    type: async (val, ctx) => {
                        if (val === "bots") return BotSymbol;
                        else return user(val, ctx);
                    },
                    default: SwitchArgumentParser.None
                },
                invert: {
                    type: Boolean,
                    default: false
                }
            })
        })
    }
    async clearMessages(ctx, m, r) {
        await Promise.all([ctx.msg.delete(), m.delete(), r.context.delete()])
        return true;
    }
    async run(ctx, {messages, contains, mentions, from, invert}) {
        if (!ctx.channel.permissionsOf(ctx.sosamba.user.id).has("manageMessages")) return ctx.send(ctx.t("MISSING_PERMISSIONS"));
        const m = await ctx.send(ctx.t("CLEAR_CONFIRM"))
        const r = await ctx.askYesNo(true);
        if (!r.response) {
            await ctx.send(ctx.t("OP_CANCELLED"))
            setTimeout(this.clearMessages, 2000, ctx, m, r);
            return;
        }
        await this.clearMessages(ctx, m, r);
        const oldestPossibleSnowflake = (BigInt(Date.now()) - D_EPOCH) << 22n;
        const msgs = await ctx.channel.getMessages(messages > 1000 ? 1000 : messages);
        const toDelete = msgs.filter(msg => {
            const v = this.matchesCriteriaContaining(msg, contains) && this.matchesCriteriaFrom(msg, from) && this.matchesCriteriaMentions(msg, mentions)
            return invert ? !v : v;
        }).map(msg => msg.id).filter(msg => {
            return msg < oldestPossibleSnowflake;
        })

        await this.deleteStrategy(ctx.channel, toDelete);
        
        const msgOK = await msg.channel.createMessage(ctx.t("CLEAR_DONE", filteredMsgIDs.length));
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
        if (from && msg.author.id == options.from.id) return true;
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