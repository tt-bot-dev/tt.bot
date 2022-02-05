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

// @ts-nocheck

import { DateTime } from "luxon";
import config from "../config.js";
import UserProfile from "./Structures/UserProfile.mjs";

const { normalDateFormat, tzDateFormat } = config;

export function getUptime(m1, m2) {
    const diff = DateTime.fromMillis(m1).diff(m2, [
        "days",
        "hours",
        "minutes",
        "seconds"
    ]);

    return `${diff.days > 0 ? Math.floor(diff.days) + " days, " : ""}${diff.hours > 0 ? Math.floor(diff.hours) + " hours, " : ""}${Math.floor(diff.minutes)} minutes, and ${Math.floor(diff.seconds)} seconds`;
}

/**
 * @param {import("sosamba").InteractionContext} ctx 
 * @returns {Promise<import("@tt-bot-dev/types").GuildConfig>}
 */
export async function getGuildConfig(ctx) {
    if (ctx._guildConfig) return ctx._guildConfig;
    return ctx._guildConfig = await ctx.sosamba.db.getGuildConfig(ctx.guild.id);
}

/**
 * @param {import("sosamba").InteractionContext} ctx 
 * @param {import("@tt-bot-dev/types").GuildConfig} config 
 */
export async function setGuildConfig(ctx, config) {
    if (typeof config !== "object") throw new TypeError("Not a valid guild config");

    const cfg = await getGuildConfig(ctx) || {};
    ctx._guildConfig = {
        ...cfg,
        ...config
    };

    await ctx.sosamba.db.updateGuildConfig(ctx.guild.id, config);

    return config;
}

/**
 * @param {import("sosamba").InteractionContext} ctx 
 * @returns {Promise<import("@tt-bot-dev/types").UserProfile>}
 */
export async function getUserProfile(ctx) {
    if (ctx._userProfile) return ctx._userProfile;
    return ctx._userProfile = new UserProfile(await ctx.sosamba.db.getUserProfile(ctx.author.id) || {
        id: ctx.author.id,
        fake: true
    });
}

/**
 * @param {import("sosamba").InteractionContext} ctx 
 * @param {UserProfile} profile 
 */
export async function setUserProfile(ctx, profile) {
    if (typeof profile !== "object" && !(profile instanceof UserProfile)) throw new TypeError("Not an object");
    ctx._userProfile = profile;
    await ctx.sosamba.db.updateUserProfile(ctx.author.id, profile.toEncryptedObject());
    return profile;
};

/**
 * @param {import("sosamba").InteractionContext} ctx 
 */
export function getUserLocale(ctx) {
    return getUserProfile(ctx).then(p => {
        if (!p.locale) return getGuildConfig(ctx).then(g => g?.locale || "en");
        else return p.locale;
    }).then(l => {
        if (!ctx.sosamba.localeManager.locales.has(l)) return "en";
        else return l;
    });
}

/**
 * @param {import("sosamba").InteractionContext} ctx
 * @param {string} name 
 * @param  {...any} args 
 * @returns {Promise<string>}
 */
export async function t(ctx, name, ...args) {
    return ctx.sosamba.localeManager.translate(await getUserLocale(ctx), name, ...args);
}


/**
 * @param {import("sosamba").InteractionContext} ctx 
 * @param {number | Date} date
 * @param {string} tz
 */
export async function formatDate(ctx, date, tz) {
    tz ??= "UTC";
    const language = await getUserLocale(ctx);
    const timeFormat = new Intl.DateTimeFormat(language, {
        ...normalDateFormat,
        timeZone: tz,
        timeZoneName: tzDateFormat.timeZoneName || tz && "short"
    });

    return timeFormat.format(date);
}