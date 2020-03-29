"use strict";
const Command = require("../lib/commandTypes/OwnerCommand");
const { SerializedArgumentParser, ParsingError } = require("sosamba");
const { ExtensionFlags } = require("../lib/extensions/API/Constants");

class AllowExtFlagCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "allowextflag",
            description: "Allows an extension to use a privileged flag",
            argParser: new SerializedArgumentParser(sosamba, {
                args: [{
                    name: "extension",
                    type: async (val, ctx) => {
                        const ext = await ctx.db.getGuildExtension(val);
                        if (!ext) throw new ParsingError("Invalid extension");
                        return ext;
                    },
                    description: "The extension to grant the flags to"
                }, {
                    name: "flags",
                    type: val => {
                        if (!Object.prototype.hasOwnProperty.call(ExtensionFlags, val)) throw new ParsingError("Invalid extension flag");
                        return ExtensionFlags[val];
                    },
                    restSplit: true,
                    description: "The flags to grant"
                }]
            })
        });
    }

    async run(ctx, [extension, ...flags]) {
        for (const flag of flags) {
            extension.flags |= flag;
            extension.privilegedFlags &= ~flag;
        }

        await ctx.db.updateGuildExtension(extension.id, {
            flags: extension.flags,
            privilegedFlags: extension.privilegedFlags
        });
        await ctx.send(`:ok_hand: Allowed the flags to ${extension.name}`);
    }
}

module.exports = AllowExtFlagCommand;