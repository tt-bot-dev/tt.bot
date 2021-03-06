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
const { getPrototypeOf } = Object;

const Role = require("../API/Role");
const Message = require("../API/Message");
const User = require("../API/User");
const Member = require("../API/Member");
/** Resolves an ID from a provided object
 * @param {Message|User|Member|Role} object User, Member, Message or Role object
 * @returns {String} The ID or passed argument if the object is not one of above objects.
 */
function resolveUserId(object) {
    if (getPrototypeOf(object) === Message.prototype) return object.author.id;
    if (getPrototypeOf(object) === User.prototype) return object.id;
    if (getPrototypeOf(object) === Member.prototype) return object.id;
    if (getPrototypeOf(object) === Role.prototype) return object.id;
    return object;
}
module.exports = resolveUserId;