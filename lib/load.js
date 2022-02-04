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
const config = require("../config");
const { token, database } = config;
const { Logger } = require("sosamba");
const Client = require("./Client");
const FormatJSLocale = require("./l10n/FormatJSLocale");
const { default: startWebServer } = require("@tt-bot-dev/web");
//const { Collection, Base } = require("eris");

module.exports = async function () {
    config.webserver ??= {};
    if (typeof config.webserver.display !== "function") {
        const oldDisplay = config.webserver.display;
        config.webserver.display = url => `${oldDisplay}${url}`;
    }

    global.console = new Logger({
        name: "Console",
        level: ["debug", "warn", "info", "log", "error"]
    });

    process.on("unhandledRejection", (r) => {
        console.warn(`Unhandled rejection, reason:\n ${require("util").inspect(r)}`);
    });
    process.on("uncaughtException", (err) => {
        console.warn("Unhandled exception", err.message);
        console.warn(err.stack);
    });

    const bot = new Client(token, {
        defaultImageSize: 1024,
        defaultImageFormat: "webp",
        compress: true,
        intents: ["guilds", "guildMembers", "guildBans",
            "guildVoiceStates", "guildMessages", "guildMessageReactions"],
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
    await bot.localeManager.findJSONLanguages(`${__dirname}/../languages`, FormatJSLocale);

    bot.connect();

    require("./util/overrideprops");
    startWebServer(bot, config);
};
