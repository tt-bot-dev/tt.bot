/**
 * Copyright (C) 2022 tt.bot dev team
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

import { Eris } from "sosamba";
import config from "../config.js";
import Command from "../lib/commandTypes/OwnerCommand.mjs";
import { inspect } from "util";
import CensorBuilder from "../lib/CensorBuilder.mjs";
import makegist from "../lib/gist.mjs";

const { Constants: { ApplicationCommandOptionTypes } } = Eris;
const { homeGuild } = config;
/**
 * @type {FunctionConstructor}
 */
// @ts-expect-error
const AsyncFunction = (async () => "").constructor;

class EvalCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "eval",
            args: [{
                name: "code",
                description: "The code to evaluate",
                type: ApplicationCommandOptionTypes.STRING,
                required: true
            }],
            description: "Evaluates JavaScript code.",
            registerIn: homeGuild
        });
    }

    async run(ctx, { code: args }) {
        let d;
        try {
            AsyncFunction

            d = await new AsyncFunction("ctx", "args",
                "require", "__dirname", "__filename", "module", args)
                .bind(this)(ctx, args, require, __dirname, __filename, module);
        } catch (err) {
            d = err.stack;
        }
        const v = typeof d === "string" ? d : inspect(d);
        const description = `\`\`\`js\n${v.replace(new CensorBuilder([], this.sosamba).build(), "/* snip */")}\n\`\`\``;
        if (description.length > 2048) {
            let gist;
            try {
                gist = await makegist("exec.md", description, "Evaluated code");
                if (!gist.ok) throw new Error();
            } catch (err) {
                await ctx.send({
                    embeds: [{
                        title: "Evaluated!",
                        color: 0x008800,
                        description: "Unfortunately, we can't provide the data here because they're too long and the request to GitHub's Gist APIs has failed.\nThereby, the output has been logged in the console."
                    }]
                });
                this.log.log(v);
                return;
            }
            return await ctx.send({
                embeds: [{
                    title: "Evaluated!",
                    color: 0x008800,
                    description: `The data are too long. [View the gist here](${gist.body.html_url})`
                }]
            });
        } else {
            ctx.send({
                embeds: [{
                    description,
                    color: 0x008800
                }]
            });
        }
    }
}

export default EvalCommand;