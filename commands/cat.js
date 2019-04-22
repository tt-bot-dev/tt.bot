const { Command } = require("sosamba");
const { get } = require("snekfetch");

class CatCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: "cat"
        });
    }

    async run(ctx, args) {
        const { body } = await get("https://aws.random.cat/meow");
        await ctx.send({
            embed: {
                image: {
                    url: body.file
                },
                color: 0x008800
            }
        })
    }
}

module.exports = CatCommand;