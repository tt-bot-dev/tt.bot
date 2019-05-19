const { Command } = require("sosamba");

class ServerCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: "serverinfo"
        });
    }

    async run(ctx) {
        const embed = {
            author: {
                name: ctx.guild.name
            },
            thumbnail: {
                url: ctx.guild.iconURL
            },
            fields: [{
                name: ctx.t("MEMBERS"),
                value: ctx.t("MEMBER_COUNT", ctx.guild.memberCount),
                inline: true
            },
            {
                name: ctx.t("OWNER"),
                value: this.sosamba.getTag(ctx.guild.members.get(ctx.guild.ownerID)),
                inline: true
            }, {
                name: ctx.t("GUILD_VERIFICATION_LEVEL"),
                value: this.getGuildVerification(ctx),
                inline: true
            }, {
                name: ctx.t("REQUIRES_ADMIN_MFA"),
                value: ctx.guild.mfaLevel == 1 ? ctx.t("YES") : ctx.t("NO"),
                inline: true
            }, {
                name: ctx.t("ROLES"),
                value: ctx.t("ROLE_COUNT", ctx.guild.roles.size),
                inline: true
            }, {
                name: ctx.t("EXPLICIT_FILTERING"),
                value: this.getExplicitContent(ctx),
                inline: true
            }, {
                name: ctx.t("DEFAULT_NOTIFICATIONS"),
                value: ctx.guild.defaultNotifications == 1
                    ? ctx.t("ONLY_MENTIONS")
                    : ctx.t("ALL_MESSAGES"),
                inline: true
            }
            ],
            description: `
**ID**: ${ctx.guild.id}
**${ctx.t("VOICE_REGION")}**: ${ctx.guild.region}
**${ctx.t("AFK_TIMEOUT")}**: ${ctx.t("AFK_MINUTES", ctx.guild.afkTimeout)}`,
            image: {
                url: `https://cdn.discordapp.com/splashes/${ctx.guild.id}/${ctx.guild.splash}`
            },
            footer: {
                text: ctx.t("CREATED_ON")
            },
            timestamp: new Date(ctx.guild.createdAt),
            color: 0x008800
        };

        await ctx.send({embed});
    }

    getGuildVerification(ctx) {
        switch (ctx.guild.verificationLevel) {
        case 0:
            return ctx.t("GUILD_VERIFICATION_NONE");

        case 1:
            return ctx.t("GUILD_VERIFICATION_LOW");

        case 2:
            return ctx.t("GUILD_VERIFICATION_MEDIUM");

        case 3:
            return "(╯°□°）╯︵ ┻━┻" + ctx.t("GUILD_VERIFICATION_TABLEFLIP");

        case 4:
            return "┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻ " + ctx.t("GUILD_VERIFICATION_ULTRATABLEFLIP");
        }
    }

    getExplicitContent(ctx) {
        switch (ctx.guild.explicitContentFilter) {
        case 0:
            return ctx.t("EXPLICIT_FILTERING_OFF");

        case 1:
            return ctx.t("EXPLICIT_FILTERING_NOROLE");

        case 2:
            return ctx.t("EXPLICIT_FILTERING_ON");
        }
    }
}

module.exports = ServerCommand;