"use strict";
const { Command } = require("sosamba");

class ModCommand extends Command {
    async permissionCheck(ctx) {
        return await this.sosamba.isModerator(ctx.member);
    }
}

module.exports = ModCommand;