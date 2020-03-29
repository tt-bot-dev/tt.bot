"use strict";
const { Command } = require("sosamba");
const ExtensionRunner = require("./extensions/Runner");
const config = require("../config");
class ExtensionCommandWrapper extends Command {
    constructor(sosamba, extension) {
        super(sosamba, undefined, undefined, {name: ""});
        this.extension = extension;
    }

    async run(ctx, args) {
        const store = await ctx.db.getGuildExtensionStore(ctx.guild.id, this.extension.store);
        const { error } = await ExtensionRunner(ctx, this.sosamba, this.extension.code, {
            id: this.extension.id,
            name: this.extension.name,
            flags: this.extension.flags,
            data: store ?
                Object.assign({}, JSON.parse(store.store), {
                    id: store.id,
                    guildID: ctx.guild.id
                })
                : { guildID: ctx.guild.id, id: null }
        }, {
            prefix: await ctx.guildConfig && (await ctx.guildConfig).prefix || config.prefix,
            trigger: this.extension.commandTrigger,
            args
        });
        if (error) throw error;
    }
}

module.exports = ExtensionCommandWrapper;