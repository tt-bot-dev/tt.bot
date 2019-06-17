"use strict";
const { Command } = require("sosamba");
const { get } = require("snekfetch");

class CatCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: "cat",
            description: "Gets a random cat picture."
        });
    }

    async run(ctx) {
        const { body } = await get("https://aws.random.cat/meow");
        await ctx.send({
            embed: {
                image: {
                    url: body.file
                },
                color: 0x008800
            }
        });
    }
}

module.exports = CatCommand;