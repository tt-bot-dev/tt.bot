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
const { version: sosambaVersion } = require("sosamba/package.json");
const ShowSymbol = Symbol("tt.bot.tags.show");
const CreateSymbol = Symbol("tt.bot.tags.create");
const EditSymbol = Symbol("tt.bot.tags.edit");
const DeleteSymbol = Symbol("tt.bot.tags.delete");
const TagObject = require("../lib/Structures/TagObject");

class TagCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "tags",
            argParser: new SerializedArgumentParser(sosamba, {
                allowQuotedString: true,
                args: [{
                    name: "action",
                    type: val => {
                        if (val === "show") return ShowSymbol;
                        else if (val === "create") return CreateSymbol;
                        else if (val === "edit") return EditSymbol;
                        else if (val === "delete") return DeleteSymbol;
                        throw new ParsingError("Invalid action");
                    },
                    description: "the action to do with the tag: show, create, edit or delete"
                }, {
                    name: "what",
                    type: String,
                    description: "the tag name"
                }, {
                    name: "value",
                    type: String,
                    default: SerializedArgumentParser.None,
                    rest: true,
                    description: "a required argument for the create and edit commands, else it isn't required"
                }],
                separator: " "
            }),
            description: "Store some data for later retrieval. Keep in mind that the tags are global and accessible by everyone.\n[ttMsg](https://github.com/tt-bot-dev/tt.bot/blob/master/docs/ttMsg.md) can be used in tags.",
            aliases: ["t"]
        });
    }

    async run(ctx, [action, tag, val]) {
        if (action === ShowSymbol) {
            const d = await ctx.db.getTag(ctx.encryptData(tag));
            if (!d) return ctx.send(await ctx.t("TAG_DOESNTEXIST"));
            const data = new TagObject(d);
            await ctx.send({
                embed: {
                    author: {
                        name: await ctx.t("TAG_DISPLAY", data.id)
                    },
                    description: this.sosamba.parseMsg(data.content, ctx.member, ctx.guild)
                }
            });
        } else if (action === DeleteSymbol) {
            const d = await ctx.db.getTag(ctx.encryptData(tag));
            if (!d) return ctx.send(await ctx.t("TAG_DOESNTEXIST"));
            if (!OwnerCommand.prototype.permissionCheck(ctx) && ctx.author.id !== d.owner) {
                return await ctx.send(await ctx.t("TAG_NOTOWNER"));
            } else {
                await ctx.db.deleteTag(ctx.encryptData(tag));
                await ctx.send(await ctx.t("TAG_DELETED", tag));
            }
        } else if (action === EditSymbol) {
            if (!val) {
                await ctx.send({
                    embed: {
                        title: ":x: Argument required",
                        description: "The argument `value` is required.",
                        color: 0xFF0000,
                        footer: {
                            text: `Sosamba v${sosambaVersion}`
                        }
                    }
                });
                return;
            }

            
            const d = await ctx.db.getTag(ctx.encryptData(tag));
            if (!d) return ctx.send(await ctx.t("TAG_DOESNTEXIST"));
            const data = new TagObject(d);
            if (!OwnerCommand.prototype.permissionCheck(ctx) && ctx.author.id !== data.owner) {
                return await ctx.send(await ctx.t("TAG_NOTOWNER"));
            } else {
                data.content = val;
                await ctx.db.updateTag(ctx.encryptData(tag),
                    data.toEncryptedObject());
                await ctx.send(await ctx.t("TAG_UPDATED", tag));
            }
        } else if (action === CreateSymbol) {
            if (!val) {
                await ctx.send({
                    embed: {
                        title: ":x: Argument required",
                        description: "The argument `value` is required.",
                        color: 0xFF0000,
                        footer: {
                            text: `Sosamba v${sosambaVersion}`
                        }
                    }
                });
                return;
            }

            if (await ctx.db.getTag(ctx.encryptData(tag)))
                return await ctx.send(await ctx.t("TAG_EXISTS"));

            await ctx.db.createTag(TagObject.create({
                id: tag,
                content: val,
                owner: ctx.author.id
            }));
            await ctx.send(await ctx.t("TAG_CREATED", tag));
        }
    }
}

module.exports = TagCommand;
