"use strict";
const { Command } = require("sosamba");

class AdminCommand extends Command {
    permissionCheck(ctx) {
        return this.sosamba.isAdmin(ctx.member);
    }
}

module.exports = AdminCommand;