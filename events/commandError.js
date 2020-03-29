"use strict";
const { Event } = require("sosamba");
const { version: sosambaVersion } = require("sosamba/package.json");
const { version } = require("../package.json");

class CommandErrorEvent extends Event {
    constructor(...args) {
        super(...args, {
            name: "commandError"
        });
    }

    async run(e, ctx) {
        if (e.constructor.name !== "ExtensionError") this.log.error(e);
        try {
            await ctx.send({
                embed: {
                    title: ":x: Error running the command",
                    description: `I am unable to run the command because of a coding error:\n\`\`\`js\n${e.stack}\n\`\`\``,
                    color: 0xFF0000,
                    footer: {
                        text: `Please report this issue on our support server or on GitHub. | tt.bot v${version} running on Sosamba v${sosambaVersion}`
                    }
                }
            });
        } catch {}
    }
}

module.exports = CommandErrorEvent;