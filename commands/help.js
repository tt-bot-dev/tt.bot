"use strict";
const { Command, SerializedArgumentParser } = require("sosamba");

class HelpCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "help",
            argParser: new SerializedArgumentParser(sosamba, {
                
            })
        });
    }
}