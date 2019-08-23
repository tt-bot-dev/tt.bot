"use strict";
const Command = require("../lib/ModCommand");
const { SimpleArgumentParser } = require("sosamba");
const { version: sosambaVersion } = require("sosamba/package.json");

class UpdateReasonCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "reason",
            args: "<caseID:String> <reason:String...>",
            argParser: new SimpleArgumentParser(sosamba, {
                separator: " "
            }),
            description: "Remove a strike from a user."
        });
    }

    async run(ctx, [caseID, ...reason]) {
        if (!caseID) {
            await ctx.send({
                embed: {
                    title: ":x: Argument required",
                    description: "The argument `caseID` is required.",
                    color: 0xFF0000,
                    footer: {
                        text: `Sosamba v${sosambaVersion}`
                    }
                }
            });
            return;
        }
        if (reason.length === 0) {
            await ctx.send({
                embed: {
                    title: ":x: Argument required",
                    description: "The argument `reason` is required.",
                    color: 0xFF0000,
                    footer: {
                        text: `Sosamba v${sosambaVersion}`
                    }
                }
            });
            return;
        }
        try {
            await this.sosamba.modLog.updateReason(caseID, ctx, reason.join(" "));
        } catch(err) {
            console.error(err);
            await ctx.send(await ctx.t("ERROR", err));
            return;
        }
        await ctx.send(":ok_hand:");
    }
}

module.exports = UpdateReasonCommand;