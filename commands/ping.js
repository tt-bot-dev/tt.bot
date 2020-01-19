"use strict";
const { Command } = require("sosamba");

class PingCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: "ping",
            description: "Shows my latency to Discord.",
            aliases: ["pong"]
        });
    }

    async run(ctx) {
        const m = await ctx.send(":ping_pong:");

        await ctx.send({
            content: "",
            embed: {
                title: await ctx.t("PONG"),
                description: await ctx.t("PING_LATENCY", m.timestamp - ctx.msg.timestamp),
                footer: {
                    text: await ctx.t("PING_DISCORD_LATENCY", ctx.guild.shard.latency)
                },
                color: 0x008800
            }
        });
    }
}

module.exports = PingCommand;