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

"use strict";
const { Command, Eris: { Constants: { UserFlags, ApplicationCommandOptionTypes }, Member } } = require("sosamba");
const { t } = require("../lib/util");

class UserCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "userinfo",
            args: [{
                name: "user",
                description: "The user to get the information about.",
                type: ApplicationCommandOptionTypes.USER,
                required: true,
            }],
            description: "Gets some information about the user.",
            aliases: ["uinfo", "user", "whois"]
        });
    }

    async run(ctx, { user }) {
        if (user instanceof Member) {
            const roles = user.roles.map(r => ctx.guild.roles.get(r).name);
            roles.unshift("@everyone");
            const nick = user.nick || this.sosamba.getTag(user);
            await ctx.send({
                embeds: [{
                    title: await t(ctx, "USER_INFO", {
                        user: `${nick}${nick === this.sosamba.getTag(user) ? "" : ` (${this.sosamba.getTag(user)})`} (${user.id}) ${user.bot ? "(BOT)" : ""}`
                    }),
                    description: user.user.publicFlags ? this.bitArrayToEmoji(ctx, this.parseUserBitfield(user.user.publicFlags)).join("\n") : undefined,
                    thumbnail: {
                        url: user.user.avatarURL
                    },
                    fields: [{
                        name: await t(ctx, "ROLES"),
                        value: roles.join(", ").length > 1024 ? await t(ctx, "TOOLONG") : roles.join(", "),
                        inline: false
                    }, {
                        name: await t(ctx, "CREATED_ON"),
                        value: await ctx.formatDate(user.createdAt, (await ctx.userProfile).timezone),
                        inline: true
                    }, {
                        name: await t(ctx, "CURRENT_VOICE"),
                        value: ctx.guild.channels.get(ctx.guild.voiceStates.get(user.id)?.channelID)
                            ?.name || await t(ctx, "NO_CURRENT_VOICE"),
                        inline: true
                    }],
                    timestamp: new Date(user.joinedAt),
                    footer: {
                        text: await t(ctx, "JOINED_ON")
                    }
                }]
            });
        } else {
            await ctx.send({
                embeds: [{
                    title: await t(ctx, "USER_INFO_LIMITED", {
                        user: `${this.sosamba.getTag(user)} ${user.bot ? "(BOT)" : ""}`
                    }),
                    description: user.publicFlags ? this.bitArrayToEmoji(ctx, this.parseUserBitfield(user.publicFlags)).join("\n") : undefined,
                    thumbnail: {
                        url: user.avatarURL
                    },
                    fields: [{
                        name: await t(ctx, "CREATED_ON"),
                        value: await ctx.formatDate(user.createdAt, (await ctx.userProfile).timezone),
                        inline: true
                    }],
                    footer: {
                        text: await t(ctx, "NOT_IN_SERVER")
                    }
                }]
            });
        }
        
    }

    parseUserBitfield(bitfield) {
        let out = [];
        for (const k of Object.keys(UserFlags)) {
            if (k === "NONE") continue;
            if (bitfield & UserFlags[k]) out.push(k);
        }
        return out;
    }

    bitArrayToEmoji(ctx, bitArray) {
        let out = [];
        const canUseExternal = this.sosamba.hasBotPermission(ctx.channel, "externalEmojis");

        // Emojis taken from discord.bots.gg Discord guild
        if (bitArray.includes("DISCORD_EMPLOYEE")) out.push(`${canUseExternal ? "<:e:314348604095594498>" : ":tools:"} This user is a Discord employee`);
        if (bitArray.includes("DISCORD_PARTNER")) out.push(`${canUseExternal ? "<:e:314068430556758017>": ":infinity:"} This user is partnered with Discord`);
        if (bitArray.includes("HYPESQUAD_EVENTS")) out.push(`${canUseExternal ? "<:e:585765895939424258>" : ":sparkles:"} This user is a HypeSquad event attendee/coordinator`);
        if (bitArray.includes("BUG_HUNTER_LEVEL_1")) out.push(`${canUseExternal ? "<:e:585765206769139723>" : ":bug:"} This user is a Discord Bug Hunter (level 1)`);
        if (bitArray.includes("HOUSE_BRAVERY")) out.push(`${canUseExternal ? "<:e:585763004218343426>" : ":shield:"} This user is in the House of Bravery`);
        if (bitArray.includes("HOUSE_BRILLIANCE")) out.push(`${canUseExternal ? "<:e:585763004495298575>" : ":sunglasses:"} This user is in the House of Brilliance`);
        if (bitArray.includes("HOUSE_BALANCE")) out.push(`${canUseExternal ? "<:e:585763004574859273>" : ":scales:"} This user is in the House of Balance`);
        if (bitArray.includes("EARLY_SUPPORTER")) out.push(`${canUseExternal ? "<:e:585763690868113455>" : ":medal:"} This user is an early supporter of Discord`);
        if (bitArray.includes("TEAM_USER")) out.push(":busts_in_silhouette: This user is tied to a [team](https://discord.com/developers/docs/topics/teams)");
        if (bitArray.includes("SYSTEM")) out.push(":robot: This user is a Discord system user");

        //Emojis taken from our internal guild
        if (bitArray.includes("BUG_HUNTER_LEVEL_2")) out.push(`${canUseExternal ? "<:e:743588190241292449>" : ":bug:"} This user is a Discord Bug Hunter (level 2)`);
        if (bitArray.includes("VERIFIED_BOT")) out.push(":white_check_mark: This bot is verified");
        if (bitArray.includes("VERIFIED_BOT_DEVELOPER")) out.push(`${canUseExternal ? "<:e:743589119799590955>" : ":white_check_mark"} This user is a verified bot developer`);

        return out;
    }
}

module.exports = UserCommand;
