"use strict";
const { Command, SerializedArgumentParser,
    Serializers: { User } } = require("sosamba");

class AvatarCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "getavatar",
            argParser: new SerializedArgumentParser(sosamba, {
                args: [{
                    default: ctx => ctx.author,
                    rest: true,
                    name: "user",
                    type: User,
                    description: "the user to get the avatar from"
                }]
            }),
            description: "Gets someone's avatar."
        });
    }

    async run(ctx, [user]) {
        await ctx.send({
            embed: {
                author: {
                    name: `${user.nick ? user.nick : user.username} (${user.username}#${user.discriminator})'s avatar`,
                    icon_url: this.sosamba.user.staticAvatarURL
                },
                image: {
                    url: user.avatarURL
                },
                description: await ctx.t("AVATAR_NOT_LOADING", user.user.dynamicAvatarURL("png", 2048))
            }
        });
    }
}

module.exports = AvatarCommand;