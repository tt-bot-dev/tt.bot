"use strict";
const { Command, SerializedArgumentParser,
    Serializers: { Member } } = require("sosamba");
const moment = require("moment");

class UserCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "userinfo",
            argParser: new SerializedArgumentParser(sosamba, {
                args: [{
                    default: ctx => ctx.member,
                    type: Member,
                    rest: true,
                    name: "user",
                    description: "the user to get the information for"
                }]
            }),
            description: "Gets some information about the user."
        });
    }

    async run(ctx, [user]) {
        const roles = user.roles.map(r => ctx.guild.roles.get(r).name);
        roles.unshift("@everyone");
        const nick = user.nick || this.sosamba.getTag(user);
        ctx.send({
            embed: {
                author: {
                    name: await ctx.t("USER_INFO", `${nick} ${nick === this.sosamba.getTag(user) ? "" : `(${this.sosamba.getTag(user)})`} (${user.id}) ${user.bot ? "(BOT)" : ""}`)
                },
                thumbnail: {
                    url: user.user.avatarURL
                },
                /* ==== Do we apply for presence events or not? ==== */
                fields: [{
                    name: await this.getStatusType(user, ctx),
                    value: await (async () => {
                        if (!user.game) return await ctx.t("PLAYING_NONE");
                        let str = "";
                        if (user.game.type !== 4) {
                            str += user.game.name + "\n";
                            if (user.game.details) str += user.game.details + "\n";
                            if (user.game.state) str += user.game.state;
                        } else {
                            str = `${user.game.emoji ?
                                `${user.game.emoji.id ? "(custom emoji)" : user.game.emoji.name}`
                                : ""} ${user.game.state || ""}`;
                        }
                        return str.trim() || await ctx.t("SPACE_UNIVERSE");
                    })(),
                    inline: true
                }, {
                    name: await ctx.t("STATUS"),
                    value: await this.getStatus(user, ctx),
                    inline: true
                }, 
                /* ==== end of possible snip ==== */
                {
                    name: await ctx.t("ROLES"),
                    value: roles.join(", ").length > 1024 ? await ctx.t("TOOLONG") : roles.join(", "),
                    inline: false
                }, {
                    name: await ctx.t("CREATED_ON"),
                    value: (await ctx.userProfile && (await ctx.userProfile).timezone) ?
                        moment(new Date(user.createdAt)).tz((await ctx.userProfile).timezone).format(config.tzDateFormat) :
                        moment(new Date(user.createdAt)).format(config.normalDateFormat),
                    inline: true
                }, {
                    name: await ctx.t("CURRENT_VOICE"),
                    value: ctx.guild.voiceStates.has(user.id) ?
                        ctx.guild.channels.get(ctx.guild.voiceStates.get(user.id).channelID)
                            .name : await ctx.t("NONE"),
                    inline: true
                }],
                timestamp: new Date(user.joinedAt),
                footer: {
                    text: await ctx.t("JOINED_ON")
                }
            }
        });
    }

    async getStatusType(user, ctx) {
        if (!user.game) return await ctx.t("PLAYING");
        switch (user.game.type) {
        case 0:
            return await ctx.t("PLAYING");
        case 1:
            return await ctx.t("STREAMING");
        case 2:
            return await ctx.t("LISTENING_TO");
        case 4:
            return "Status";
        }
    }

    async getStatus(user, ctx) {
        switch (user.status) {
        case "online":
            return await ctx.t("ONLINE");
        case "idle":
            return await ctx.t("IDLE");
        case "dnd":
            return await ctx.t("DND");
        case "offline":
            return await ctx.t("OFFLINE");
        }
    }
}

module.exports = UserCommand;