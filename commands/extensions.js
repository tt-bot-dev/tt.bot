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
const { SerializedArgumentParser } = require("sosamba");
const { role: findRole, channel: findChannel } = require("sosamba/lib/argParsers/switchSerializers/erisObjects");
const { get } = require("chainfetch");
const Command = require("../lib/commandTypes/AdminCommand");
const MessageAsyncIterator = require("../lib/MessageAsyncIterator");
const createUUID = require("uuid/v4");
const ListSymbol = Symbol("tt.bot.extensions.list");
const CreateSymbol = Symbol("tt.bot.extensions.create");
const DeleteSymbol = Symbol("tt.bot.extensions.delete");
const uuidregex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

class ExtensionCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "extensions",
            argParser: new SerializedArgumentParser(sosamba, {
                allowQuotedString: true,
                args: [{
                    name: "action",
                    description: "The action to do: `list`, `create`, `delete`",
                    type: val => {
                        if (val === "list") return ListSymbol;
                        else if (val === "create") return CreateSymbol;
                        else if (val === "delete") return DeleteSymbol;
                    }
                }, {
                    name: "arg",
                    description: "When used with `list`, specifies the page.\nWhen used with `delete`, specifies the extension ID.",
                    type: String,
                    default: SerializedArgumentParser.None
                }]
            }),
            description: "Manage your extensions from Discord."
        });
    }

    async run(ctx, [action, id]) {
        if (action === ListSymbol) {
            const extensions = await ctx.db.getGuildExtensions(ctx.guild.id);
            if (extensions.length === 0) {
                await ctx.send(await ctx.t("NO_EXTENSIONS"));
                return;
            }
            let page = 0;
            if (id > 1) page = parseInt(id - 1);
            if (isNaN(page)) page = 0;
            const pageIndex = page === 0 ? 0 : page * 25 - 1;

            const ext = extensions.slice(pageIndex, (page + 1) * 25 - 1);
            if (ext.length === 0) {
                await ctx.send(await ctx.t("NO_MORE_EXTENSIONS"));
                return;
            }
            await ctx.send({
                embed: {
                    title: await ctx.t("EXTENSION_LIST", ctx.guild),
                    description: await ctx.t("PAGE", page + 1),
                    fields: await Promise.all(ext.map(async e => ({
                        name: e.name,
                        value: await ctx.t("EXTENSION_LIST_FIELD", e)
                    }))),
                    color: 0x008800
                }
            });
        } else if (action === CreateSymbol) {
            await ctx.send(await ctx.t("QUESTION_EXTENSION_CODE"));
            let codeContext, jsCode;
            try {
                codeContext = await ctx.waitForMessage(c => {
                    if (c.msg.attachments.length === 0) return false;
                    const attachment = c.msg.attachments.find(a => /.+\.js$/.test(a.filename));
                    c.codeAttachment = attachment;
                    return !!attachment;
                }, 60000);
            } catch {
                await ctx.send(await ctx.t("OP_CANCELLED"));
                return;
            }

            try {
                const { body } = await get(codeContext.codeAttachment.url).toString();
                jsCode = body;
            } catch {
                await ctx.send(await ctx.t("OP_CANCELLED"));
                return;
            }
            try {
                await codeContext.msg.delete();
            } catch { }

            await ctx.send(await ctx.t("QUESTION_EXTENSION_NAME"));
            let name;
            try {
                name = await ctx.waitForMessage(c => c.msg.content.length <= 100, 60000);
            } catch {
                await ctx.send(await ctx.t("OP_CANCELLED"));
                return;
            }
            const { msg: { content: extensionName } } = name;
            try {
                await name.msg.delete();
            } catch { }
            await ctx.send(await ctx.t("QUESTION_EXTENSION_TRIGGER"));
            let trigger;
            try {
                trigger = await ctx.waitForMessage(c =>
                    !c.msg.content.includes(" ") && c.msg.content.length <= 20
                    && !this.sosamba.commands.has(c.msg.content.toLowerCase())
                );
            } catch {
                await ctx.send(await ctx.t("OP_CANCELLED"));
                return;
            }
            const { msg: { content: commandTrigger } } = trigger;
            try {
                await trigger.msg.delete();
            } catch { }
            await ctx.send(await ctx.t("QUESTION_EXTENSION_CHANNEL_RESTRICT"));
            const { response: restrictChannels, context: ctx1 } = await ctx.askYesNo(true);
            try {
                await ctx1.msg.delete();
            } catch { }
            const allowedChannels = restrictChannels ? await this.doQuestionMenu(ctx, false) : [];

            await ctx.send(await ctx.t("QUESTION_EXTENSION_ROLE_RESTRICT"));
            const { response: restrictRoles, context } = await ctx.askYesNo(true);
            try {
                await context.msg.delete();
            } catch { }
            const allowedRoles = restrictRoles ? await this.doQuestionMenu(ctx, true) : [];

            await ctx.send(await ctx.t("QUESTION_EXTENSION_STORE"));
            const { response: doStore, context: ctx2 } = await ctx.askYesNo(true);
            try {
                await ctx2.msg.delete();
            } catch { }

            let store;
            if (doStore) {
                await ctx.send(await ctx.t("QUESTION_EXTENSION_STORE_ID"));
                const { msg } = await ctx.waitForMessage(
                    c => uuidregex.test(c.msg.content), 60000);
                try {
                    await msg.delete();
                } catch { }
                const stor = await ctx.db.getGuildExtensionStore(ctx.guild.id, msg.content);
                if (!store) {
                    await ctx.send(`${await ctx.t("STORE_NONEXISTANT")} ${await ctx.t("OP_CANCELLED")}`);
                    return;
                }
                store = stor.id;
            } else {
                const tryInsert = async () => {
                    const id = createUUID();
                    try {
                        await ctx.db.createGuildExtensionStore(ctx.guild.id, id);
                        return id;
                    } catch {
                        return tryInsert();
                    }
                };
                store = await tryInsert();
                await ctx.msg.channel.createMessage(await ctx.t("STORE_CREATED", store));
            }

            const tryInsertExtension = async () => {
                const id = createUUID();
                try {
                    await ctx.db.createGuildExtension({
                        code: jsCode,
                        allowedChannels,
                        allowedRoles,
                        name: extensionName,
                        commandTrigger,
                        guildID: ctx.guild.id,
                        store,
                        id
                    });
                    return id;
                } catch {
                    return tryInsertExtension();
                }
            };
            await ctx.send(await ctx.t("EXTENSION_CREATED", extensionName, await tryInsertExtension()));
        } else if (action === DeleteSymbol) {
            const ext = await ctx.db.getGuildExtension(id);
            if (!ext || ext && ext.guildID !== ctx.guild.id) {
                await ctx.send(await ctx.t("EXTENSION_NONEXISTANT"));
                return;
            }

            await ctx.send(await ctx.t("QUESTION_EXTENSION_DELETE", ext));
            const resp = await ctx.askYesNo();
            if (resp) {
                await ctx.db.deleteGuildExtension(id);
                await ctx.send(await ctx.t("QUESTION_EXTENSION_DELETE_STORE", ext));
                const deleteStore = await ctx.askYesNo();
                if (deleteStore) {
                    const store = await ctx.db.getGuildExtensionStore(ctx.guild.id, ext.store);
                    if (!store) {
                        await ctx.send(await ctx.t("STORE_DELETE_NONEXISTANT"));
                        return;
                    }
                    await ctx.db.deleteGuildExtensionStore(ctx.guild.id, ext.store);
                    await ctx.send(await ctx.t("STORE_DELETED", ext));
                }
            } else {
                await ctx.send(await ctx.t("OP_CANCELLED"));
            }
        }
    }

    async embedStructure(ctx, selected, isRole) {
        const context = isRole ? "ROLES" : "CHANNELS";
        return {
            content: "",
            embed: {
                title: await ctx.t(`ALLOWED_${context}`),
                description: await ctx.t("EXTENSION_MENU_SUBTEXT",
                    `\n${await ctx.t("MENU_CURRENTLY_SELECTED", isRole)} ${selected.join(", ") || "All"}`),
                fields: [{
                    name: await ctx.t("ALLOWED_CHANNELS_ACTION_ADD"),
                    value: await ctx.t("ALLOWED_CHANNELS_ACTION_ADD_DESCRIPTION", isRole),
                    inline: true
                }, {
                    name: await ctx.t("ALLOWED_CHANNELS_ACTION_REMOVE"),
                    value: await ctx.t("ALLOWED_CHANNELS_ACTION_REMOVE_DESCRIPTION", isRole),
                    inline: true
                }, {
                    name: await ctx.t("ALLOWED_CHANNELS_ACTION_DONE"),
                    value: await ctx.t("ALLOWED_CHANNELS_ACTION_DONE_DESCRIPTION", isRole),
                    inline: true
                }]
            }
        };
    }

    async doQuestionMenu(ctx, isRole) {
        const allowed = [];
        await ctx.send(await this.embedStructure(ctx,
            [], isRole));
        for await (const c of MessageAsyncIterator(ctx, c =>
            ["a", "r", "d"].includes(c.msg.content.toLowerCase())
        )) {
            try {
                await c.msg.delete();
            } catch { }
            const action = c.msg.content.toLowerCase();
            if (action === "a") {
                let r;
                try {
                    await ctx.send(await ctx.t("QUESTION_ALLOWED_CHANNELS_ADD", isRole));
                    const resp = await ctx.waitForMessage(undefined, 30000);
                    if (isRole) {
                        r = await findRole(resp.msg.content.toLowerCase(), ctx, {
                            name: "the specified role"
                        });
                    } else {
                        r = await findChannel(resp.msg.content.toLowerCase(), ctx, {
                            name: "the specified role"
                        });
                    }
                    try {
                        await resp.msg.delete(); 
                    } catch { }
                } catch (e) {
                    console.error(e);
                    await ctx.send(await ctx.t("COMMAND_ERROR"));
                    continue;
                }

                if (allowed.includes(r.id)) {
                    await ctx.send(await ctx.t("CHANNEL_ALLOWED_ALREADY", isRole));
                    continue;
                }
                allowed.push(r.id);
            } else if (action === "r") {
                let r;
                try {
                    await ctx.send(await ctx.t("QUESTION_ALLOWED_CHANNELS_REMOVE", isRole));
                    const resp = await ctx.waitForMessage(undefined, 30000);
                    if (isRole) r = await findRole(resp.msg.content.toLowerCase(), ctx, {
                        name: "the specified role"
                    }); else r = await findChannel(resp.msg.content.toLowerCase(), ctx, {
                        name: "the specified channel"
                    });
                    try {
                        await resp.msg.delete(); 
                    } catch { }
                } catch (e) {
                    console.error(e);
                    await ctx.send(await ctx.t("COMMAND_ERROR"));
                    continue;
                }

                if (!allowed.includes(r.id)) {
                    await ctx.send(await ctx.t("CHANNEL_DISALLOWED_ALREADY", isRole));
                    continue;
                }
                allowed.splice(allowed.indexOf(r.id), 1);
            } else if (action === "d") {
                break;
            }
            await ctx.send(await this.embedStructure(ctx,
                allowed.map(c => `<${isRole ? "@&" : "#"}${c}>`), true));
        }

        return allowed;

    }
}

module.exports = ExtensionCommand;