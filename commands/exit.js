"use strict";
const Command = require("../lib/commandTypes/OwnerCommand");
const { STOP_REASONS } = require("sosamba/lib/Constants");

class ExitCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: "exit",
            description: "Kills the bot, shutting down all reaction menus and message listeners gracefully."
        });
    }
    async run(ctx) {
        this.sosamba.reactionMenus.forEach(menu => {
            this.sosamba.reactionMenus.remove(menu);
            menu.stopCallback(STOP_REASONS.SHUTDOWN);
        });
        this.sosamba.messageListeners.clear();
        await ctx.send(":wave:");
        process.exit(0);
    }
}

module.exports = ExitCommand;