"use strict";
const { Command } = require("sosamba");
const { get } = require("chainfetch");

class DogCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: "dog",
            description: "Gets a random dog picture."
        });
    }

    async run(ctx) {
        const { body } = await get("https://random.dog/woof.json?filter=mp4,webm").toJSON();

        ctx.send({
            embed: {
                image: {
                    url: body.url
                },
                color: 0x008800
            }
        });
    }
}

module.exports = DogCommand;