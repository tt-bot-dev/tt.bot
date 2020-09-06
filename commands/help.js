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
const { Command, SerializedArgumentParser, ParsingError, ReactionMenu } = require("sosamba");
const ModCommand = require("../lib/commandTypes/ModCommand");
const OwnerCommand = require("../lib/commandTypes/OwnerCommand");
const AdminCommand = require("../lib/commandTypes/AdminCommand");
const CommandResolver = (val) => {
                        if (!this.sosamba.commands.has(val)) throw new ParsingError("Command not found");
                        return this.sosamba.commands.get(val);
                    };
CommandResolver.typeHint = "Command";
class HelpCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "help",
            argParser: new SerializedArgumentParser(sosamba, {
                args: [{
                    name: "command",
                    type: CommandResolver,
                    default: SerializedArgumentParser.None,
                    description: "The command to get help about"
                }]
            }),
            displayInHelp: false,
            description: "Gets information on how to use me.",
            aliases: ["commands"]
        });
    }

    async run(ctx, [command]) {
        if (command) {
            await ctx.send({
                embed: {
                    author: {
                        name: await ctx.t("HELP_FOR_COMMAND", command.id)
                    },
                    fields: [{
                        name: await ctx.t("HELP_ARGUMENTS"),
                        value: `${command.argParser ? `\`${command.argParser.provideUsageString(false) || command.args}\`` : command.args ? `\`${command.args}\`` : ""}

${command.argParser ? command.argParser.provideUsageString(true) : ""}`.trim() || await ctx.t("NONE"),
                    }, {
                        name: await ctx.t("HELP_ALIASES"),
                        value: command.aliases.join(", ") || await ctx.t("NONE"),
                        inline: true
                    }, {
                        name: await ctx.t("HELP_DESCRIPTION"),
                        value: command.description || await ctx.t("NONE"),
                        inline: true
                    }],
                    color: 0x008800
                }
            });
        } else {
            const ownerCommands = this.sosamba.commands.filter(c => c instanceof OwnerCommand).filter(e => e.displayInHelp);
            const adminCommands = this.sosamba.commands.filter(c => c instanceof AdminCommand).filter(e => e.displayInHelp);
            const modCommands = this.sosamba.commands.filter(c => c instanceof ModCommand).filter(e => e.displayInHelp);
            const generalCommands = this.sosamba.commands.filter(c => 
                !ownerCommands.includes(c) && !adminCommands.includes(c) && !modCommands.includes(c))
                .filter(e => e.displayInHelp);
            const extensionCommands = (await ctx.db.getGuildExtensions(ctx.guild.id))
                .filter(e => {
                    if (e.allowedChannels.length !== 0 && !e.allowedChannels.includes(ctx.channel.id)) return;
                    if (e.allowedRoles.length !== 0 && !e.allowedRoles.find(r => ctx.member.roles.includes(r))) return;
                    return true;
                })
                .map(e => ({
                    id: e.commandTrigger,
                    description: `${e.name} (${e.id})`
                }));
            const permissions = await HelpMenu.getPermissions(ctx);

            const m = await ctx.send(await HelpMenu.DEFAULT_OBJ(ctx, permissions));
            ctx.registerReactionMenu(new HelpMenu(ctx, m, {
                owner: ownerCommands,
                admin: adminCommands,
                mod: modCommands, 
                general: generalCommands,
                extensions: extensionCommands
            }, permissions));
        }
    }
}

class HelpMenu extends ReactionMenu {
    constructor(ctx, msg, commands, permissions) {
        super(ctx, msg);
        this.commands = commands;
        this.permissions = permissions;
        this.timeout = 60000;
        this.callbacks = {
            [HelpMenu.HOME]: async () => this.ctx.send(await HelpMenu.DEFAULT_OBJ(this.ctx, this.permissions)),
            [HelpMenu.PUBLIC]: async () => this.listCommands(HelpMenu.PUBLIC),
        };
        if (this.permissions[1]) this.callbacks[HelpMenu.OWNER] = async () => this.listCommands(HelpMenu.OWNER);
        if (this.permissions[2]) this.callbacks[HelpMenu.MOD] = async () => this.listCommands(HelpMenu.MOD);
        if (this.permissions[3]) this.callbacks[HelpMenu.ADMIN] = async () => this.listCommands(HelpMenu.ADMIN);
        
        this.callbacks[HelpMenu.EXTENSION] = async () => this.listCommands(HelpMenu.EXTENSION);
    }

    async listCommands(e) {
        const fields = await Promise.all(this.getCommands(e).sort((a, b) => a.id.localeCompare(b.id)).map(async c => ({
            name: c.id,
            value: c.description || await this.ctx.t("HELP_NO_DESCRIPTION")
        })));
        await this.ctx.send({
            embed: {
                color: 0x008800,
                author: {
                    name: `${e} ${await this.getCategoryName(e)}`
                },
                fields,
                footer: {
                    text: await this.ctx.t("HELP_REMINDER")
                }
            }
        });
    }

    getCommands(e) {
        if (e === HelpMenu.PUBLIC) return this.commands.general;
        else if (e === HelpMenu.OWNER) return this.commands.owner;
        else if (e === HelpMenu.MOD) return this.commands.mod;
        else if (e === HelpMenu.ADMIN) return this.commands.admin;
        else if (e === HelpMenu.EXTENSION) return this.commands.extensions;
        else return null;
    }

    async getCategoryName(e) {
        if (e === HelpMenu.ADMIN) return await this.ctx.t("HELP_ADMIN");
        else if (e === HelpMenu.PUBLIC) return await this.ctx.t("HELP_PUBLIC");
        else if (e === HelpMenu.MOD) return await this.ctx.t("HELP_MOD");
        else if (e === HelpMenu.OWNER) return await this.ctx.t("HELP_OWNER");
        else if (e === HelpMenu.EXTENSION) return "Extensions";
        else if (e === HelpMenu.HOME) return 0;
        else return 1;
    }

    async canRunCallback(emoji) {
        if ([HelpMenu.HOME, HelpMenu.PUBLIC, HelpMenu.EXTENSION].includes(emoji)) return true;
        if (emoji === HelpMenu.OWNER) return this.permissions[1];
        if (emoji === HelpMenu.MOD) return this.permissions[2];
        if (emoji === HelpMenu.ADMIN) return this.permissions[3];
    }

    static async getPermissions(ctx) {
        return [true, OwnerCommand.prototype.permissionCheck(ctx),
            await ModCommand.prototype.permissionCheck.call({ sosamba: ctx.sosamba }, ctx),
            AdminCommand.prototype.permissionCheck.call({ sosamba: ctx.sosamba }, ctx),
            true];
    }

    static async DEFAULT_OBJ(ctx, permissions) {
        return {
            embed: {
                description: await ctx.t("HELP_HOME", HelpMenu, permissions, { t: ctx.t.bind(ctx) }),
                color: 0x008800
            }
        };
    }
}
HelpMenu.ADMIN = "\u{1F6E0}";
HelpMenu.MOD = "\u{1F528}";
HelpMenu.OWNER = "\u{1F6AB}";
HelpMenu.PUBLIC = "\u{1F465}";
HelpMenu.EXTENSION = "🔧";
HelpMenu.HOME = "🏠";
HelpMenu.MESSAGES = async ctx => [`${HelpMenu.PUBLIC} ${await ctx.t("HELP_PUBLIC")}`,
    `${HelpMenu.OWNER} ${await ctx.t("HELP_OWNER")}`,
    `${HelpMenu.MOD} ${await ctx.t("HELP_MOD")}`,
    `${HelpMenu.ADMIN} ${await ctx.t("HELP_ADMIN")}`,
    `${HelpMenu.EXTENSION} Extensions`];

module.exports = HelpCommand;
