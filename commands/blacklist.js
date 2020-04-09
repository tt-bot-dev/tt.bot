const Command = require("../lib/commandTypes/OwnerCommand");
const { SerializedArgumentParser } = require("sosamba");
const QuerySymbol = Symbol("tt.bot.blacklist.query");
const AddSymbol = Symbol("tt.bot.blacklist.add");
const RemoveSymbol = Symbol("tt.bot.blacklist.remove");

class BlacklistManagerCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "blacklist",
            argParser: new SerializedArgumentParser(sosamba, {
                args: [{
                    type: val => {
                        if (val === "query") return QuerySymbol;
                        else if (val === "add") return AddSymbol;
                        else if (val === "remove") return RemoveSymbol;
                    },
                    name: "action",
                    description: "the action to do"
                }, {
                    type: String,
                    restSplit: true,
                    name: "args",
                    description: "<guild ID/owner ID> [reason if action===\"add\"]",
                    default: SerializedArgumentParser.None
                }]
            })
        })
    }

    async run(ctx, [action, guildID, ...reasonSplit]) {
        if (action === QuerySymbol) {
            const guilds = await ctx.db.getBlacklistedGuildById(guildID);
            if (guilds.length === 0) {
                return await ctx.send({
                    embed: {
                        title: ":x: Cannot find blacklisted guilds by these IDs.",
                        description: "It's not blacklisted. Check the ID and try again.",
                        color: 0xFF0000
                    }
                });
            }

            const fields = guilds.map(g => ({
                name: `${g.id} ${g.ownerID ? `(owned by ${g.ownerID})` : ""}`,
                value: g.reason || "no reason"
            }));

            return await ctx.send({
                embed: {
                    title: "Here are the blacklisted guilds for this ID",
                    color: 0x008800,
                    fields: fields.slice(0, 25)
                }
            });
        } else if (action === AddSymbol) {
            const guild = await this.sosamba.guilds.get(guildID);
            let ownerID;
            if (guild) ({ ownerID } = guild);
            await ctx.db.addBlacklistedGuild(guildID, ownerID, reasonSplit.join(" "));
            await this.sosamba.guilds.filter(g => g.id === guildID || g.ownerID === ownerID)
                .forEach(g => {
                    g.__automaticallyLeft = true;
                    g.leave()
                });
            await ctx.send(":ok_hand:");
        } else if (action === RemoveSymbol) {
            await ctx.db.removeBlacklistedGuild(guildID);
            await ctx.send(":ok_hand:");
        }
    }
}

module.exports = BlacklistManagerCommand;