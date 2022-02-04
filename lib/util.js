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
const luxon = require("luxon");
const config = require("../config");
const UserProfile = require("./Structures/UserProfile");
module.exports = {
    getUptime(m1, m2) {
        const diff = luxon.DateTime.fromMillis(m1).diff(m2, [
            "days",
            "hours",
            "minutes",
            "seconds"
        ]);

        return `${diff.days > 0 ? Math.floor(diff.days) + " days, " : ""}${diff.hours > 0 ? Math.floor(diff.hours) + " hours, " : ""}${Math.floor(diff.minutes)} minutes, and ${Math.floor(diff.seconds)} seconds`;
    },

    async getGuildConfig(ctx) {
        if (ctx._guildConfig) return ctx._guildConfig;
        return ctx._guildConfig = await ctx.sosamba.db.getGuildConfig(ctx.guild.id);
    },

    async setGuildConfig(ctx, config) {
        if (typeof config !== "object") throw new TypeError("Not a valid guild config");

        const cfg = await this.getGuildConfig(ctx) || {};
        ctx._guildConfig = {
            ...cfg,
            ...config
        };

        await ctx.sosamba.db.updateGuildConfig(ctx.guild.id, val);

        return val;
    },

    async getUserProfile(ctx) {
        if (ctx._userProfile) return ctx._userProfile;
        return ctx._userProfile = new UserProfile(await ctx.sosamba.db.getUserProfile(ctx.author.id) || {
            id: ctx.author.id,
            fake: true
        });
    },

    async setUserProfile(ctx, profile) {
        if (typeof profile !== "object" && !(profile instanceof UserProfile)) throw new TypeError("Not an object");
        ctx._userProfile = profile;
        await ctx.sosamba.db.updateUserProfile(ctx.author.id, profile.toEncryptedObject());
        return profile;
    },

    getUserLocale(ctx) {
        return this.getUserProfile(ctx).then(p => {
            if (!p.locale) return this.getGuildConfig(ctx).then(g => g?.locale || "en");
            else return p.locale;
        }).then(l => {
            if (!ctx.sosamba.localeManager.locales.has(l)) return "en";
            else return l;
        });
    },

    async t(ctx, name, ...args) {
        return ctx.sosamba.localeManager.translate(await this.getUserLocale(ctx), name, ...args);
    },

    async formatDate(ctx, date, tz) {
        tz ??= "UTC";
        const language = await this.getUserLocale(ctx);
        const timeFormat = new Intl.DateTimeFormat(language, {
            ...config.normalDateFormat,
            timeZone: tz,
            timeZoneName: config.tzDateFormat.timeZoneName || tz && "short"
        });

        return timeFormat.format(date);
    }
};