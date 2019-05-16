"use strict";
const { Command } = require("sosamba");

class InviteCommand extends Command {
    constructor(...args) {
        super(...args, { 
            name: "invite"
        });
    }

    async run(ctx) {
        ctx.send(ctx.t("BOT_INVITE"));
    }
}

module.exports = InviteCommand;