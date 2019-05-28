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
                    name: "user"
                }]
            })
        });
    }

    async run(ctx, [user]) {
        const roles = user.roles.map(r => ctx.guild.roles.get(r).name);
        roles.unshift("@everyone");
        const nick = user.nick || this.sosamba.getTag(user);
        ctx.send({
            embed: {
                author: {
                    name: ctx.t("USER_INFO", `${nick} ${nick === this.sosamba.getTag(user) ? "" : `(${this.sosamba.getTag(user)})`} (${user.id}) ${user.bot ? "(BOT)" : ""}`)
                },
                thumbnail: {
                    url: user.user.avatarURL
                },
                fields: [{
                    name: this.getStatusType(user, ctx),
                    value: (() => {
                        if (!user.game) return ctx.t("PLAYING_NONE");
                        let str = "";
                        str += user.game.name + "\n";
                        if (user.game.details) str += user.game.details + "\n";
                        if (user.game.state) str += user.game.state;
                        return str.trim() || ctx.t("SPACE_UNIVERSE");
                    })(),
                    inline: true
                }, {
                    name: ctx.t("STATUS"),
                    value: this.getStatus(user, ctx),
                    inline: true
                }, {
                    name: ctx.t("ROLES"),
                    value: roles.join(", ").length > 1024 ? ctx.t("TOOLONG") : roles.join(", "),
                    inline: true
                }, {
                    name: ctx.t("CREATED_ON"),
                    value: (await ctx.userProfile && (await ctx.userProfile).timezone) ?
                        moment(new Date(user.createdAt)).tz((await ctx.userProfile).timezone).format(config.tzDateFormat) :
                        moment(new Date(user.createdAt)).format(config.normalDateFormat),
                    inline: true
                }, {
                    name: ctx.t("CURRENT_VOICE"),
                    value: user.voiceState.channelID ? ctx.guild.channels.get(user.voiceState.channelID).name : ctx.t("NONE"),
                    inline: true
                }],
                timestamp: new Date(user.joinedAt),
                footer: {
                    text: ctx.t("JOINED_ON")
                }
            }
        });
    }

    getStatusType(user, ctx) {
        if (!user.game) return ctx.t("PLAYING");
        switch (user.game.type) {
        case 0:
            return ctx.t("PLAYING");
        case 1:
            return ctx.t("STREAMING");
        case 2:
            return ctx.t("LISTENING_TO");
        }
    }

    getStatus(user, ctx) {
        switch (user.status) {
        case "online":
            return ctx.t("ONLINE");
        case "idle":
            return ctx.t("IDLE");
        case "dnd":
            return ctx.t("DND");
        case "offline":
            return ctx.t("OFFLINE");
        }
    }
}

module.exports = UserCommand;