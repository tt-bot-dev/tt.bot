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

import { Command, Eris } from "sosamba";
import OwnerCommand from "../lib/commandTypes/OwnerCommand.mjs";
import TagObject from "../lib/Structures/TagObject.mjs";
import { encrypt } from "../lib/dataEncryption.mjs";
import { t } from "../lib/util.mjs";

const { Constants: { ApplicationCommandOptionTypes } } = Eris;

class TagCommand extends Command {
    constructor(sosamba, fn, fp) {
        super(sosamba, fn, fp, {
            name: "tags",
            description: "Store some text for later retrieval. Keep in mind that tags are global and accessible by everyone.",
            args: [
                {
                    name: "show",
                    description: "Shows the contents of a tag",
                    type: ApplicationCommandOptionTypes.SUB_COMMAND,
                    options: [{
                        name: "name",
                        description: "The tag name",
                        type: ApplicationCommandOptionTypes.STRING,
                        required: true,
                    }],
                },
                {
                    name: "create",
                    description: "Creates a tag",
                    type: ApplicationCommandOptionTypes.SUB_COMMAND,
                    options: [
                        {
                            name: "name",
                            description: "The tag name",
                            type: ApplicationCommandOptionTypes.STRING,
                            required: true,
                        }, {
                            name: "content",
                            description: "New tag contents",
                            type: ApplicationCommandOptionTypes.STRING,
                            required: true,
                        },
                    ],
                },
                {
                    name: "edit",
                    description: "Edits a tag",
                    type: ApplicationCommandOptionTypes.SUB_COMMAND,
                    options: [
                        {
                            name: "name",
                            description: "The tag name",
                            type: ApplicationCommandOptionTypes.STRING,
                            required: true,
                        }, {
                            name: "content",
                            description: "New tag contents",
                            type: ApplicationCommandOptionTypes.STRING,
                            required: true,
                        },
                    ],
                },
                {
                    name: "delete",
                    description: "Deletes a tag",
                    type: ApplicationCommandOptionTypes.SUB_COMMAND,
                    options: [{
                        name: "name",
                        description: "The tag name",
                        type: ApplicationCommandOptionTypes.STRING,
                        required: true,
                    }],
                },
            ],
        });
    }

    async run(ctx, { name, content }) {
        switch (ctx.subcommand) {
        case "show": {
            const d = await this.sosamba.db.getTag(encrypt(name));
            if (!d) return ctx.send(await t(ctx, "TAG_DOESNTEXIST"));
            const data = new TagObject(d);
            await ctx.send({
                embeds: [{
                    author: {
                        name: await t(ctx, "TAG_DISPLAY", {
                            tag: data.id,
                        }),
                    },
                    description: this.sosamba.parseMsg(data.content, ctx.member, ctx.guild),
                }],
            });
            break;
        }

        case "delete": {
            const d = await this.sosamba.db.getTag(encrypt(name));
            if (!d) return ctx.send(await t(ctx, "TAG_DOESNTEXIST"));
            if (!OwnerCommand.prototype.permissionCheck(ctx) && ctx.author.id !== d.owner) {
                return await ctx.send(await t(ctx, "TAG_NOTOWNER"));
            } else {
                await this.sosamba.db.deleteTag(encrypt(name));
                await ctx.send(await t(ctx, "TAG_DELETED", { tag: name }));
            }
            break;
        }

        case "edit": {
            const d = await this.sosamba.db.getTag(encrypt(name));
            if (!d) return ctx.send(await t(ctx, "TAG_DOESNTEXIST"));
            const data = new TagObject(d);
            if (!OwnerCommand.prototype.permissionCheck(ctx) && ctx.author.id !== data.owner) {
                return await ctx.send(await t(ctx, "TAG_NOTOWNER"));
            } else {
                data.content = content;
                await this.sosamba.db.updateTag(encrypt(name),
                    data.toEncryptedObject());
                await ctx.send(await t(ctx, "TAG_UPDATED", {
                    tag: name,
                }));
            }
            break;
        }

        case "create": {
            if (await this.sosamba.db.getTag(encrypt(name)))
                return await ctx.send(await t(ctx, "TAG_EXISTS"));

            await this.sosamba.db.createTag(TagObject.create({
                id: name,
                content,
                owner: ctx.author.id,
            }));
            await ctx.send(await t(ctx, "TAG_CREATED", { tag: name }));
            break;
        }
        }
    }
}

export default TagCommand;
