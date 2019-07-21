"use strict";
const { Command } = require("sosamba");
const moment = require("moment");
const config = require("../config");

class InfoCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: "info",
            description: "Shows the information about the bot and its owners.",
        });
    }

    async run(ctx) {
        const ownerStrings = Array.isArray(config.oid) ? 
            config.oid.map(i => this.getOwnerInfo(this.sosamba.users.get(i))) : 
            [this.getOwnerInfo(this.sosamba.users.get(config.oid))];
        await ctx.send({
            embed: {
                author: {
                    name: this.sosamba.user.username,
                    icon_url: this.sosamba.user.staticAvatarURL
                }, 
                fields: [{
                    name: await ctx.t("INFO_STATS"),
                    value: await ctx.t("INFO_STATS_TEXT"),
                    inline: true
                }, {
                    name: await ctx.t("INFO_AUTHORS"),
                    value: await ctx.t("INFO_OWNERS", ownerStrings),
                    inline: true
                }, {
                    name: await ctx.t("INFO_VERSIONS"),
                    value: `tt.bot: ${require("../package.json").version}\nSosamba: ${require("sosamba/package.json").version}\nEris: ${require("eris/package.json").version}\nNode.js: ${process.versions.node}\nV8 engine: ${process.versions.v8}`,
                    inline: true
                },
                {
                    name: await ctx.t("INFO_UPTIME"),
                    value: this.getUptime(moment(), moment(Date.now() - this.sosamba.uptime)),
                    inline: true
                }],
                color: 0x008800
            }
        });
    }

    getOwnerInfo(owner) {
        return `<@${owner.id}> (${owner ? owner.username + "#" + owner.discriminator : "Sorry, my owner isn't in my cache ;-;"})`;
    }

    getUptime(m1, m2) {
        const d = moment.duration(m1.diff(m2));
        return `${d.days() > 0 ? d.days() + " days, " : ""}${d.hours() > 0 ? d.hours() + " hours, " : ""}${d.minutes()} minutes, and ${d.seconds()} seconds`;
    }
}

module.exports = InfoCommand;