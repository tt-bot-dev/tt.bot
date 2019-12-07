"use strict";
const { Event } = require("sosamba");
const { version: sosambaVersion } = require("sosamba/package.json")
const { version } = require("../package.json");

class CommandErrorEvent extends Event {
    constructor(...args) {
        super(...args, {
            name: "commandError"
        });
    }

    prerequisites(e) {
        return e.constructor.name !== "ExtensionError";
    }

    async run(e, ctx) {
        this.log.error(e);
        try {
            await ctx.send({
                embed: {
                    title: ":x: Error running the command",
                    description: `I am unable to run the command because of a coding error:\n\`\`\`js\n${e.stack}\n\`\`\``,
                    color: 0xFF0000,
                    footer: {
                        text: `Please tell the command developers about this. | tt.bot v${version} running on Sosamba v${sosambaVersion}`
                    }
                }
            });
        } catch {}
    }
}

module.exports = CommandErrorEvent;