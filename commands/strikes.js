const { Command, SerializedArgumentParser, Serializers: { User } } = require("sosamba");

class StrikeListCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "strikes",
            argParser: new SerializedArgumentParser(sosamba, {
                args: [{
                    name: "user",
                    type: User,
                    default: ctx => ctx.author,
                    rest: true
                }]
            })
        });
    }

    async run(ctx, [user]) {
        if (user.bot) {
            await ctx.send(ctx.t("BOTS_NOT_STRIKABLE"));
            return;
        }
            const strikes = await this.sosamba.modLog.getUserStrikes(user.id, ctx);
            if (strikes > 25) {
                const strikeStr = strikes.map(s => `${s.id} - ${s.reason}`);
                await ctx.send(ctx.t("TOO_MUCH_STRIKES"), {
                    file: Buffer.from(strikeStr.join("\r\n")),
                    name: "strikes.txt"
                });
            } else {
                await ctx.send({
                    embed: {
                        author: {
                            name: ctx.t("STRIKE_OVERVIEW", this.sosamba.getTag(user)),
                            fields: strikes.map(s => ({
                                name: `ID: ${s.id}`,
                                value: s.reason
                            }))
                        }
                    }
                })
            }
    }
}

module.exports = StrikeListCommand;