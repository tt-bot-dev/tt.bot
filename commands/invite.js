"use strict";
const { Command } = require("sosamba");

class InviteCommand extends Command {
    constructor(...args) {
        super(...args, { 
            name: "invite",
            description: "Sends a link to invite me."
        });
    }

    async run(ctx) {
        ctx.send(await ctx.t("BOT_INVITE"));
    }
}

module.exports = InviteCommand;