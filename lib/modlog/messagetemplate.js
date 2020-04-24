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
const { PunishTexts, PunishColors, PunishTypes } = require("./constants");
const config = require("../../config");
module.exports = function generateMessage(type, id, user, issuer, reason, obj, bot) {
    let obje = {
        title: `${PunishTexts[type] ? PunishTexts[type] : "Unknown type"} ${id ? `| ${id}` : ""}`,
        author: {
            name: bot.getTag(user),
            icon_url: user.avatarURL
        },
        fields: [{
            name: "Reason",
            value: reason || "No reason provided."
        }],
        footer: {
            text: `Issued by ${bot.getTag(issuer)} | Use ${config.prefix}reason ${id} <reason> to edit the reason`,
            icon_url: issuer.avatarURL
        },
        color: PunishColors[type] || null
    };
    if (type === PunishTypes.STRIKE_REMOVE) obje.fields.push({
        name: "Strike ID",
        value: obj.id
    });
    return obje;
};