"use strict";
const { SwitchArgumentParser, Serializers: { User } } = require("sosamba");
const Command = require("../lib/commandTypes/ModCommand");
const BanCommand = require("./ban");

class SoftbanCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "softban",
            argParser: new SwitchArgumentParser(sosamba, {
                user: {
                    type: User,
                    description: "the user to softban"
                },
                reason: {
                    type: String,
                    default: "No reason provided.",
                    description: "the optional reason for the softban"
                }
            }),
            description: "Softbans a user."
        });
    }

    async permissionCheck(ctx) {
        return ctx.member.permission.has("banMembers") || await super.permissionCheck(ctx);
    }

    async run(ctx, {user, reason}) {
        await BanCommand.prototype.run.call(this, ctx, { user, reason, soft: true });
    }
}

module.exports = SoftbanCommand;