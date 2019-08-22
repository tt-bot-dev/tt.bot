"use strict";
const { Command } = require("sosamba");

class ServerCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: "serverinfo",
            description: "Shows the information about the server."
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
                name: await ctx.t("MEMBERS"),
                value: await ctx.t("MEMBER_COUNT", ctx.guild.memberCount),
                inline: true
            },
            {
                name: await ctx.t("OWNER"),
                value: this.sosamba.getTag(ctx.guild.members.get(ctx.guild.ownerID)),
                inline: true
            }, {
                name: await ctx.t("GUILD_VERIFICATION_LEVEL"),
                value: await this.getGuildVerification(ctx),
                inline: true
            }, {
                name: await ctx.t("REQUIRES_ADMIN_MFA"),
                value: ctx.guild.mfaLevel == 1 ? await ctx.t("YES") : await ctx.t("NO"),
                inline: true
            }, {
                name: await ctx.t("ROLES"),
                value: await ctx.t("ROLE_COUNT", ctx.guild.roles.size),
                inline: true
            }, {
                name: await ctx.t("EXPLICIT_FILTERING"),
                value: await this.getExplicitContent(ctx),
                inline: true
            }, {
                name: await ctx.t("DEFAULT_NOTIFICATIONS"),
                value: ctx.guild.defaultNotifications == 1
                    ? await ctx.t("ONLY_MENTIONS")
                    : await ctx.t("ALL_MESSAGES"),
                inline: true
            },
            {
                name: "Features",
                value: await (async () => {
                    let featureStr = "";
                    if (ctx.guild.features.includes("INVITE_SPLASH")) featureStr += ":cityscape: This server can have an invite splash\n"
                    if (ctx.guild.features.includes("VIP_REGIONS")) featureStr += ":loud_sound: This server has access to higher-quality voice servers\n";
                    if (ctx.guild.features.includes("VANITY_URL")) featureStr += ":link: This server can have a vanity URL\n";
                    if (ctx.guild.features.includes("VERIFIED")) featureStr += ":white_check_mark: This server is verified\n";
                    if (ctx.guild.features.includes("PARTNERED")) featureStr += ":star: This server is partnered with Discord\n";
                    if (ctx.guild.features.includes("COMMERCE")) featureStr += ":moneybag: This server has access to commerce features (store channels, for example)\n";
                    if (ctx.guild.features.includes("NEWS")) featureStr += ":newspaper: This server can have announcement channels\n";
                    if (ctx.guild.features.includes("LURKABLE")) featureStr += ":eyes: This server is lurkable\n";
                    if (ctx.guild.features.includes("DISCOVERABLE")) featureStr += ":mag: This server can be found in the server discovery menu\n";
                    if (ctx.guild.features.includes("FEATURABLE")) featureStr += ":star2: This server can be featured in the server discovery menu\n";
                    if (ctx.guild.features.includes("ANIMATED_ICON")) featureStr += ":mountain: This server can have an animated icon\n";
                    if (ctx.guild.features.includes("BANNER")) featureStr += ":sunrise_over_mountains: This server can have a banner\n";
                    return featureStr || await ctx.t("NONE")
                })()
            }],
            description: `
**ID**: ${ctx.guild.id}
**${await ctx.t("VOICE_REGION")}**: ${ctx.guild.region}
**${await ctx.t("AFK_TIMEOUT")}**: ${await ctx.t("AFK_MINUTES", ctx.guild.afkTimeout)}`,
            image: {
                url: `https://cdn.discordapp.com/splashes/${ctx.guild.id}/${ctx.guild.splash}`
            },
            footer: {
                text: await ctx.t("CREATED_ON")
            },
            timestamp: new Date(ctx.guild.createdAt),
            color: 0x008800
        };

        await ctx.send({embed});
    }

    async getGuildVerification(ctx) {
        switch (ctx.guild.verificationLevel) {
        case 0:
            return await ctx.t("GUILD_VERIFICATION_NONE");

        case 1:
            return await ctx.t("GUILD_VERIFICATION_LOW");

        case 2:
            return await ctx.t("GUILD_VERIFICATION_MEDIUM");

        case 3:
            return "(╯°□°）╯︵ ┻━┻" + await ctx.t("GUILD_VERIFICATION_TABLEFLIP");

        case 4:
            return "┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻ " + await ctx.t("GUILD_VERIFICATION_ULTRATABLEFLIP");
        }
    }

    async getExplicitContent(ctx) {
        switch (ctx.guild.explicitContentFilter) {
        case 0:
            return await ctx.t("EXPLICIT_FILTERING_OFF");

        case 1:
            return await ctx.t("EXPLICIT_FILTERING_NOROLE");

        case 2:
            return await ctx.t("EXPLICIT_FILTERING_ON");
        }
    }
}

module.exports = ServerCommand;
