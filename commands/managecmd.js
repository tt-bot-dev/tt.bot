const { Command, SerializedArgumentParser, ParsingError } = require("sosamba");
const { promises: { stat }} = require("fs");
const { relative, parse, join } = require("path");
const UnloadSymbol = Symbol("tt.bot.manage.unload");
const LoadSymbol = Symbol("tt.bot.manage.load");
const ReloadSymbol = Symbol("tt.bot.manage.reload");


class ManagementCommand extends Command {
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
                        throw new ParsingError("Invalid action")
                    }
                }, {
                    name: "what",
                    type: a => {
                        const cmd = a.toLowerCase();
                        if (this.sosamba.commands.has(cmd)) return this.sosamba.commands.get(cmd);
                        return a;
                    }
                }]
            })
        })
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
                    description: `This might take a while.`
                }
            });
            try {
                await what.unmount();
                await ctx.send({
                    embed: {
                        title: `:white_check_mark: Unloaded ${what.name} successfully`,
                        color: 0x008800
                    }
                });
            } catch (err) {
                await ctx.send({
                    embed: {
                        title: `:x: Cannot unload ${what} due to a coding error`,
                        description: `Here's what happened: \`\`\`js\n${err.stack}\n\`\`\``,
                        color: 0xFF0000
                    }
                })
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
                        description: `Please check (and fix) your filesystem permissions.`,
                        footer: {
                            text: "Keep in mind, that the paths are relative to your working directory."
                        },
                        color: 0xFF0000
                    }
                });
                console.error(e)
                return;
            }

            if (d.isDirectory()) {
                await ctx.send({
                    embed: {
                        title: `:stopwatch: Loading all commands in ${what}`,
                        description: `This may take a while.`
                    }
                });

                await this.sosamba.loadCommands(`${process.cwd()}/${relative(process.cwd(), what)}`); // here it reads relative to CWD
                await ctx.send({
                    embed: {
                        title: `:white_check_mark: Successfully loaded ${what}`,
                        color: 0x008800
                    }
                })
            } else {
                // Taken from Sosamba itself
                await ctx.send({
                    embed: {
                        title: `:stopwatch: Loading ${what}`,
                        description: `This may take a while.`
                    }
                })
                const p = require.resolve(`${process.cwd()}/${relative(process.cwd(), what)}`);
                let f;
                try {
                    // But here it doesn't. So we force it to be relative to it.
                    f = require(p)
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
                    await ctx.send({
                        embed: {
                            title: `:x: Cannot load ${what} due to a coding error`,
                            description: `The command is not an instance of the [Command](https://tt-bot-dev.github.io/sosamba/?api=sosamba#Sosamba.Command) class.`,
                            color: 0xFF0000
                        }
                    });
                    return;
                }
                const fp = parse(p);

                const cmdClass = new f(this.sosamba, p, fp.dir);
                cmdClass.mount();
                const c = this.sosamba.commands.add(cmdClass);
                if (cmdClass !== c) {
                    cmdClass.unmount();
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
                })
            }
        }
    }
}

module.exports = ManagementCommand;