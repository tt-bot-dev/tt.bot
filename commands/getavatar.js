"use strict";
const { Command, SerializedArgumentParser,
    Serializers: { User } } = require("sosamba");
const userByID = require("../lib/util/userByID");

class AvatarCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "getavatar",
            argParser: new SerializedArgumentParser(sosamba, {
                args: [{
                    default: ctx => ctx.author,
                    rest: true,
                    name: "user",
                    type: [User, userByID],
                    description: "the user to get the avatar from"
                }]
            }),
            description: "Gets someone's avatar.",
            aliases: ["avatar"]
        });
    }

    async run(ctx, [user]) {
        await ctx.send({
            embed: {
                author: {
                    name: `${this.sosamba.getTag(user)}'s avatar`
                },
                image: {
                    url: user.avatarURL
                },
                description: await ctx.t("AVATAR_NOT_LOADING", user.dynamicAvatarURL("png", 2048))
            }
        });
    }
}

module.exports = AvatarCommand;