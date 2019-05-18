"use strict";
const { Command } = require("sosamba");
const { inspect } = require("util");
const AsyncFunction = (async () => "").constructor;
const CensorBuilder = require("../lib/CensorBuilder");
const gist = require("../lib/gist");
class EvalCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "eval",
        });
    }

    async run(ctx, args) {
        let d;
        try {
            d = await new AsyncFunction("ctx", "args", args).bind(this)(ctx, args);
        } catch (err) {
            d = err.stack;
        }
        const v = typeof d === "string" ? d : inspect(d);
        const description = `\`\`\`js\n${v.replace(new CensorBuilder().build(), "no.")}\n\`\`\``;
        if (description.length > 2048) {
            let gist;
            try {
                gist = await gist("exec.md", data, "Evaluated code");
            } catch (err) {
                await msg.channel.createMessage({
                    embed: {
                        title: "Evaluated!",
                        color: 0x008800,
                        description: "Unfortunately, we can't provide the data here because they're too long and the request to GitHub's Gist APIs has failed.\nThereby, the output has been logged in the console."
                    }
                });
                this.log.log(v);
                return; // we don't replace anything here, because that's console
            }
            return await ctx.send({
                embed: {
                    title: "Evaluated!",
                    color: 0x008800,
                    description: `The data are too long. [View the gist here](${gist.body.html_url})`
                }
            });
        } else {
            ctx.send({
                embed: {
                    description,
                    color: 0x008800
                }
            });
        }
    }
}

module.exports = EvalCommand;