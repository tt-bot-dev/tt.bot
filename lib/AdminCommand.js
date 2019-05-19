const { Command } = require("sosamba");

class AdminCommand extends Command {
    async permissionCheck(ctx) {
        return await this.sosamba.isAdmin(ctx.member);
    }
}

module.exports = AdminCommand;