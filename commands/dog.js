const { Command } = require("sosamba");
const { get } = require("snekfetch");

class DogCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: "dog",
        })
    }

    async run(ctx) {
        const { body } = await get("https://random.dog/woof.json");

        ctx.send({
            embed: {
                image: {
                    url: body.url
                },
                color: 0x008800
            }
        })
    }
}

module.exports = DogCommand;