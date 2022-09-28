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


import update from "./logging/handlers/update.mjs";
import unknownDelete from "./logging/handlers/unknownDelete.mjs";
import _delete from "./logging/handlers/delete.mjs";
import bulkDelete from "./logging/handlers/bulkDelete.mjs";
import ban from "./logging/handlers/ban.mjs";

export const availableTypes = ["messageUpdate", "messageDelete", "messageBulkDelete", "messageUnknownDelete", "guildBan", "guildUnban"];

export const handlers = {
    update,
    unknownDelete,
    delete: _delete,
    bulkDelete,
    ban,
};

export async function getInfo(guildID, db) {
    if (!guildID) return { logChannel: null, logEvents: [] };
    else {
        const config = await db.getGuildConfig(guildID);
        if (!config) return { logChannel: null, logEvents: [] };
        else {
            if (!config.logChannel || !config.logEvents) return {
                logChannel: null,
                logEvents: [],
            };
            if (config.logEvents.split(";").includes("all")) return {
                logChannel: config.logChannel,
                logEvents: availableTypes,
            };
            return {
                logChannel: config.logChannel,
                logEvents: config.logEvents.split(";")
                    .filter(l => availableTypes.includes(l)),
            };
        }
    }
}
