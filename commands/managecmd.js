/**
 * Copyright (C) 2020 tt.bot dev team
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
const { Command, SerializedArgumentParser, ParsingError } = require("sosamba");
const OwnerCommand = require("../lib/commandTypes/OwnerCommand");
const { promises: { stat }} = require("fs");
const { relative, parse, join } = require("path");
const UnloadSymbol = Symbol("tt.bot.manage.unload");
const LoadSymbol = Symbol("tt.bot.manage.load");
const ReloadSymbol = Symbol("tt.bot.manage.reload");


class ManagementCommand extends OwnerCommand {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "managecmd",
            argParser: new SerializedArgumentParser(sosamba, {
                args: [{
                    name: "action",
                    type: a => {
                        const action = a.toLowerCase();
                        if (action === "unload") return UnloadSymbol;
                        if (action === "load") return LoadSymbol;
                        if (action === "reload") return ReloadSymbol;
                        throw new ParsingError("Invalid action");
                    },
                    description: "the action to do with the command"
                }, {
                    name: "what",
                    type: a => {
                        const cmd = a.toLowerCase();
                        if (this.sosamba.commands.has(cmd)) return this.sosamba.commands.get(cmd);
                        return a;
                    },
                    description: "the command"
                }]
            }),
            description: "Manages the commands.",
        });
    }

    async run(ctx, [action, what]) {
        if (action === UnloadSymbol) {
            if (!(what instanceof Command)) {
                await ctx.send({
                    embed: {
                        title: `:x: Cannot unload ${what}`,
                        description: `${what} is not a command.`,
                        color: 0xFF0000
                    }
                });
                return;
            }
            await ctx.send({
                embed: {
                    title: `:stopwatch: Unloading ${what.name}`,
                    description: "This might take a while."
                }
            });
            try {
                await what.unmount();
                await ctx.send({
                    embed: {
                        title: `:white_check_mark: Successfully unloaded ${what.name}`,
                        color: 0x008800
                    }
                });
            } catch (err) {
                await ctx.send({
                    embed: {
                        title: `:x: Cannot unload ${what.name} due to a coding error`,
                        description: `Here's what happened: \`\`\`js\n${err.stack}\n\`\`\``,
                        color: 0xFF0000
                    }
                });
            }
        } else if (action === LoadSymbol) {
            if (what instanceof Command) {
                await ctx.send({
                    embed: {
                        title: `:white_check_mark: ${what.name} is already loaded`,
                        color: 0x008800
                    }
                });
                return;
            }
            if (!/\.(?:js|node)$/.test(what)) what += ".js";
            let d;
            try {
                d = await stat(what);
            } catch(e) {
                await ctx.send({
                    embed: {
                        title: `:x: Cannot load ${what} because I cannot access it`,
                        description: "Please check (and fix) your filesystem permissions.",
                        footer: {
                            text: "Keep in mind that the paths are relative to your working directory."
                        },
                        color: 0xFF0000
                    }
                });
                this.log.error(e);
                return;
            }

            if (d.isDirectory()) {
                await ctx.send({
                    embed: {
                        title: `:stopwatch: Loading all commands in ${what}`,
                        description: "This may take a while."
                    }
                });

                await this.sosamba.loadCommands(`${process.cwd()}/${relative(process.cwd(), what)}`); // here it reads relative to CWD
                await ctx.send({
                    embed: {
                        title: `:white_check_mark: Successfully loaded ${what}`,
                        color: 0x008800
                    }
                });
            } else {
                // Taken from Sosamba itself
                await ctx.send({
                    embed: {
                        title: `:stopwatch: Loading ${what}`,
                        description: "This may take a while."
                    }
                });
                const p = require.resolve(`${process.cwd()}/${relative(process.cwd(), what)}`);
                let f;
                try {
                    // But here it doesn't. So we force it to be relative to it.
                    f = require(p);
                } catch(err) {
                    await ctx.send({
                        embed: {
                            title: `:x: Cannot load ${what} due to a coding error`,
                            description: `Here's what happened: \`\`\`js\n${err.stack}\n\`\`\``,
                            color: 0xFF0000
                        }
                    });
                    return;
                }

                if (!(f.prototype instanceof Command)) {
                    delete require.cache[p];
                    await ctx.send({
                        embed: {
                            title: `:x: Cannot load ${what} due to a coding error`,
                            description: "The command is not an instance of the [Command](https://tt-bot-dev.github.io/sosamba/?api=sosamba#Sosamba.Command) class.",
                            color: 0xFF0000
                        }
                    });
                    return;
                }
                const fp = parse(p);

                const cmdClass = new f(this.sosamba, p, fp.dir);
                await cmdClass.mount();
                const c = this.sosamba.commands.add(cmdClass);
                if (cmdClass !== c) {
                    delete require.cache[p];
                    await cmdClass.unmount();
                    await ctx.send({
                        embed: {
                            title: `:x: Cannot load ${what} due to a conflict`,
                            description: `The command name \`${cmdClass.id}\` conflicts with another command located at ${join(c.path, c.file)}.`,
                            color: 0xFF0000
                        }
                    });
                    
                    return;
                }

                await ctx.send({
                    embed: {
                        title: `:white_check_mark: Successfully loaded ${what}`,
                        color: 0x008800
                    }
                });
            }
        } else if (action === ReloadSymbol) {
            if (!(what instanceof Command)) {
                await ctx.send({
                    embed: {
                        title: `:x: Cannot unload ${what}`,
                        description: `${what} is not a command.`,
                        color: 0xFF0000
                    }
                });
                return;
            }
            await ctx.send({
                embed: {
                    title: `:stopwatch: Reloading ${what.name}`,
                    description: "This may take a while."
                }
            });

            await what.unmount();
            const k = require.resolve(`${what.path}/${what.file}`);
            const c = require.cache[k];

            delete require.cache[k];

            let f;

            try {
                f = require(k);
            } catch(err) {
                require.cache[k] = c;
                await what.mount();
                this.sosamba.commands.add(what);
                await ctx.send({
                    embed: {
                        title: `:x: Cannot reload ${what.name} due to a coding error`,
                        description: `Here's what happened: \`\`\`js\n${err.stack}\n\`\`\``,
                        footer: {
                            text: "The old copy of the command was loaded back."
                        },
                        color: 0xFF0000
                    }
                });
                return;
            }
            if (!(f.prototype instanceof Command)) {
                
                require.cache[k] = c;
                await what.mount();
                this.sosamba.commands.add(what);
                await ctx.send({
                    embed: {
                        title: `:x: Cannot reload ${what.name} due to a coding error`,
                        description: "The command is not an instance of the [Command](https://tt-bot-dev.github.io/sosamba/?api=sosamba#Sosamba.Command) class.",
                        footer: {
                            text: "The old copy of the command was loaded back."
                        },
                        color: 0xFF0000
                    }
                });
                return;
            }

            const cmdClass = new f(this.sosamba, what.file, what.path);
            await cmdClass.mount();
            this.sosamba.commands.add(cmdClass);
            await ctx.send({
                embed: {
                    title: `:white_check_mark: Successfully reloaded ${what.name}${cmdClass.name !== what.name ? ` as ${cmdClass.name}` : ""}`,
                    color: 0x008800
                }
            });

        }
    }
}

module.exports = ManagementCommand;