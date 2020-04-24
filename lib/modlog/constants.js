/**
 * Copyright (C) 2020 tt.bot dev team
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
const Constants = {
    PunishTypes: {
        STRIKE:         0,
        KICK:           1,
        SOFTBAN:        2,
        BAN:            3,
        STRIKE_REMOVE:  4,
        REMOVED_STRIKE: 5
    },
    PunishColors: {
        STRIKE:         0xebef0b,
        KICK:           0xefb20a,
        SOFTBAN:        0xef840a,
        BAN:            0xcc1010,
        STRIKE_REMOVE:  0x3acc0e,
        REMOVED_STRIKE: 0x3acc0e,
        [0]:            0xebef0b,
        [1]:            0xefb20a,
        [2]:            0xef840a,
        [3]:            0xcc1010,
        [4]:            0x3acc0e,
        [5]:            0x3acc0e
    },
    PunishTexts: {
        STRIKE:         "Strike",
        KICK:           "Kick",
        SOFTBAN:        "Softban",
        BAN:            "Ban",
        STRIKE_REMOVE:  "Strike remove",
        REMOVED_STRIKE: "Removed strike",
        [0]:            "Strike",
        [1]:            "Kick",
        [2]:            "Softban",
        [3]:            "Ban",
        [4]:            "Strike remove",
        [5]:            "Removed strike"
    }
};
module.exports = Constants;
