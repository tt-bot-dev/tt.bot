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
const luxon = require("luxon");
module.exports = {
    getUptime(m1, m2) {
        const diff = luxon.DateTime.fromMillis(m1).diff(m2, [
            "days",
            "hours",
            "minutes",
            "seconds"
        ]);

        return `${diff.days > 0 ? Math.floor(diff.days) + " days, " : ""}${diff.hours > 0 ? Math.floor(diff.hours) + " hours, " : ""}${Math.floor(diff.minutes)} minutes, and ${Math.floor(diff.seconds)} seconds`;
    }
};