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
const Role = require("../API/Role");
const { getPrototypeOf } = Object;

/** Resolves an ID from a provided object
 * @param {Role} object Role object
 * @returns {String} The ID or passed argument if the object is not one of above objects.
 */
function resolveRoleId(object) {
    if (getPrototypeOf(object) === Role.prototype) return object.id;
    return object;
}

module.exports = resolveRoleId;