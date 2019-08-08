"use strict";
const { Command, SerializedArgumentParser, ParsingError } = require("sosamba");
const { version: sosambaVersion } = require("sosamba/package.json");
const ShowSymbol = Symbol("tt.bot.tags.show");
const CreateSymbol = Symbol("tt.bot.tags.create");
const EditSymbol = Symbol("tt.bot.tags.edit");
const DeleteSymbol = Symbol("tt.bot.tags.delete");
const TagObject = require("../lib/structures/TagObject");
const UserProfile = require("../lib/Structures/UserProfile");
const {oid} = require("../config");

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
            description: "Store some data for later retrieval. Keep in mind that the tags are global and accessible by everyone."
        });
    }

    async run(ctx, [action, tag, val]) {
        if (action === ShowSymbol) {
            const d = await ctx.db.getTag(ctx.encryptData(tag));
            if (!d) return ctx.send(await ctx.t("TAG_DOESNTEXIST"));
            const data = new TagObject(d);
            const pData = await ctx.db.getUserProfile(data.owner);
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
            if (!oid.includes(ctx.author.id) && ctx.author.id !== d.owner) {
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
            if (!oid.includes(ctx.author.id) && ctx.author.id !== data.owner) {
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