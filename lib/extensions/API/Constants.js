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
/**
 * Constants to help people building an extension
 */
const r = {
    ChannelTypes: {
        text: 0,
        dm: 1,
        voice: 2,
        category: 4,
        news: 5,
        store: 6
    },
    AuditLogActions: {},
    ExtensionFlags: {
        httpRequests: 1,
        guildSettings: 1 << 1,
        dangerousGuildSettings: 1 << 2,
        guildModerative: 1 << 3,
        guildMembersMeta: 1 << 4,
        mentionEveryone: 1 << 5
    }
};

/**
 * Copy over Eris' audit log constants over to our constants
 */
const { Constants: { AuditLogActions } } = require("eris");
Object.keys(AuditLogActions)
    .forEach(k => r.AuditLogActions[k] = AuditLogActions[k]);

module.exports = r;