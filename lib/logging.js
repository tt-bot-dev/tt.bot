/**
 * Copyright (C) 2021 tt.bot dev team
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
const logging = {
    availableTypes: ["messageUpdate", "messageDelete", "messageBulkDelete", "messageUnknownDelete", "guildBan", "guildUnban"],
    handlers: {
        update: require("./logging/handlers/update"),
        unknownDelete: require("./logging/handlers/unknownDelete"),
        delete: require("./logging/handlers/delete"),
        bulkDelete: require("./logging/handlers/bulkDelete"),
        ban: require("./logging/handlers/ban")
    },
    async getInfo(guildID, db) {
        if (!guildID) return { logChannel: null, logEvents: [] };
        else {
            const config = await db.getGuildConfig(guildID);
            if (!config) return { logChannel: null, logEvents: [] };
            else {
                if (!config.logChannel || !config.logEvents) return {
                    logChannel: null,
                    logEvents: []
                };
                if (config.logEvents.split(";").includes("all")) return {
                    logChannel: config.logChannel,
                    logEvents: logging.availableTypes
                };
                return {
                    logChannel: config.logChannel,
                    logEvents: config.logEvents.split(";")
                        .filter(l => logging.availableTypes.includes(l))
                };
            }
        }
    }
};
module.exports = logging;