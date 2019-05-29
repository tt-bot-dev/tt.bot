"use strict";
const { Command, SerializedArgumentParser, Serializers: {
    User
} } = require("sosamba");
const UserProfile = require("../lib/Structures/UserProfile");
const moment = require("moment");
const { tzDateFormat } = require("../config");

class TimeForCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "timefor",
            argParser: new SerializedArgumentParser(sosamba, {
                args: [{
                    default: ctx => ctx.author,
                    name: "user",
                    rest: true,
                    type: User
                }]
            })
        })
    }

    async run(ctx, [user]) {
        const profile = await ctx.db.table("profile").get(user.id);
        if (!profile) return await ctx.send(
            ctx.t(`PROFILE${user.id === ctx.author.id ? "" : `_SPECIFIC`}_NONEXISTENT`,
                this.sosamba.getTag(user)));
        const data = new UserProfile(profile);
        if (!data.timezone) return await ctx.send(ctx.t("NO_TZ"));
        this.log.debug(moment(new Date()).tz(data.timezone)
        .format(tzDateFormat), this.sosamba.getTag(user));
        return ctx.send(ctx.t("TIME_FOR",
            moment(new Date()).tz(data.timezone)
                .format(tzDateFormat), this.sosamba.getTag(user)));
    }
}

module.exports = TimeForCommand;