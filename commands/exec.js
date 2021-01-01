/**
 * Copyright (C) 2021 tt.bot dev team
 * 
 * This file is part of tt.bot.
 * 
 * tt.bot is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * tt.bot is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with tt.bot.  If not, see <http://www.gnu.org/licenses/>.
 */

"use strict";
const Command = require("../lib/commandTypes/OwnerCommand");
const CensorBuilder = require("../lib/CensorBuilder");
const makegist = require("../lib/gist");
const { spawn } = require("child_process");
const ANSIRegex = new RegExp(
    ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
        "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"].join("|")
    , "g");
class ExecCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: "exec",
            description: "Executes shell commands."
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
                windowsHide: true,
                stdio: ["ignore", "pipe", "pipe"],
                shell: true,
                env: Object.assign({}, process.env, {
                    TERM: "dumb"
                })
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
        try {
            overall = await this.exec(args); 
        } catch (err) {
            overall = err.message; this.log.error(err.stack); 
        }
        const censor = new CensorBuilder([], this.sosamba);
        let description = `\`\`\`\n${overall.replace(censor.build(), "/* snip */").replace(ANSIRegex, "")}\n\`\`\``;
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