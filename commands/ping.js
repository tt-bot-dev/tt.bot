const { Command } = require("sosamba");

class PingCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: "ping"
        });
    }

    async run(ctx) {
        const m = await ctx.send(":ping_pong:");

        await ctx.send({
            content: "",
            embed: {
                title: ctx.t("PONG"),
                description: ctx.t("PING_LATENCY", m.timestamp - ctx.msg.timestamp),
                footer: {
                    text: ctx.t("PING_DISCORD_LATENCY", ctx.guild.shard.latency)
                },
                color: 0x008800
            }
        })
    }
}

module.exports = PingCommand