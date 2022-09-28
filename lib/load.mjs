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

import config from "../config.js";
import { Logger } from "sosamba";
import Client from "./Client.mjs";
import FormatJSLocale from "./l10n/FormatJSLocale.mjs";
import webServerModule from "@tt-bot-dev/web";
import inspector from "inspector";

import "./util/overrideprops.mjs";
import { fileURLToPath } from "url";
import { join } from "path";
import { inspect } from "util";

const { token, database } = config;

export default async function() {
    // @ts-expect-error: it's there...
    config.webserver ??= {};
    if (typeof config.webserver.display !== "function") {
        const oldDisplay = config.webserver.display;
        config.webserver.display = url => `${oldDisplay}${url}`;
    }

    if (!inspector.url()) globalThis.console = new Logger({
        name: "Console",
        level: ["debug", "warn", "info", "log", "error"],
    });

    process.on("unhandledRejection", (r) => {
        console.warn(`Unhandled rejection, reason:\n ${inspect(r)}`);
    });
    process.on("uncaughtException", (err) => {
        console.warn("Unhandled exception", err.message);
        console.warn(err.stack);
    });

    const bot = new Client(token, {
        defaultImageSize: 1024,
        defaultImageFormat: "webp",
        compress: true,
        intents: ["guilds",
            "guildMembers",
            "guildBans",
            "guildVoiceStates",
            "guildMessages",
            "guildMessageReactions"],
        prefix: async ctx => {
            const prefixes = [config.prefix];
            const cfg = await ctx.guildConfig;
            if (cfg && cfg.prefix !== config.prefix) prefixes.push(cfg.prefix);
            return prefixes;
        },
        defaultLocale: "en",
        restMode: true,
        registerSlashCommandsIn: config.deployCommandsToHomeGuild ? config.homeGuild : undefined,
    }, database);

    const currentFile = fileURLToPath(import.meta.url);
    await bot.localeManager.findJSONLanguages(join(currentFile, "../../languages"), FormatJSLocale);

    bot.connect();

    webServerModule(bot, config);
}
