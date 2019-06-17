"use strict";
const ExecCommand = require("./exec");
const Command = require("../lib/OwnerCommand");

class PullCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: "pull",
            description: "Pulls the latest changes from git."
        });
        this.exec = ExecCommand.prototype.exec.bind(this);
    }

    async run(ctx) {
        return ExecCommand.prototype.run.call(this, ctx, "git pull");
    }
}

module.exports = PullCommand;