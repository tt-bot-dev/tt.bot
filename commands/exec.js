"use strict";
const Command = require("../lib/OwnerCommand");
const CensorBuilder = require("../lib/CensorBuilder");
const makegist = require("../lib/gist");
const { spawn } = require("child_process");
class ExecCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: "exec"
        });
    }
    exec(command) {
        return new Promise((rs, rj) => {
            const [cmd, ...args] = command.split(" ");
            let b = [];
            const endHandler = (c, s) => {
                b.push(Buffer.from(`======= Program ${s ? `killed with the ${s} signal` : `exited with code ${c}`} =======`));
                rs(Buffer.concat(b).toString());
            };
            const s = spawn(cmd, args, {
                windowsHide: true, // Do not create a window if run inside PM2
                stdio: ["ignore", "pipe", "pipe"], // Do not pipe stdin
                shell: true,

            });
            s.on("error", e => rj(e))
                .on("exit", endHandler)
                .on("close", endHandler);
            s.stdout.on("data", d => b.push(d));
            s.stderr.on("data", d => b.push(d));
        });
    }

    async run(ctx, args) {
        let overall;
        try { overall = await this.exec(args); }
        catch (err) { overall = err.message; this.log.error(err.stack); }
        const censor = new CensorBuilder();
        let description = `\`\`\`\n${overall.replace(censor.build(), "no.")}\n\`\`\``;
        if (description.length > 2048) {
            let gist;
            try {
                gist = await makegist("exec.md", description, "Evaluated code");
            } catch (err) {
                await ctx.send({
                    embed: {
                        title: "Executed!",
                        color: 0x008800,
                        description: "Unfortunately, we can't provide the data here because they're too long and the request to GitHub's Gist APIs has failed.\nThereby, the output has been logged in the console."
                    }
                });
                this.log.log(overall);
                return; // we don't replace anything here, because that's console
            }
            return await ctx.send({
                embed: {
                    title: "Executed!",
                    color: 0x008800,
                    description: `The data are too long. [View the gist here](${gist.body.html_url})`
                }
            });
        }
        await ctx.send({
            embed: {
                title: "Executed!",
                description,
                color: 0x008800
            }
        });
    }
}

module.exports = ExecCommand;