const {SimpleArgumentParser} = require("sosamba");
const Command = require("../lib/ModCommand");

class HackbanCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "hackban",
            args: "<users:String...>",
            argParser: new SimpleArgumentParser(sosamba, {
                separator: " ",
                filterEmptyArguments: true
            }),
            description: "Bans an user by ID."
        })
    }

    async run(ctx, users) {
        
    }
}