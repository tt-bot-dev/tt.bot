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
const { pbkdf2Sync, createCipheriv, createDecipheriv } = require("crypto");
const password = pbkdf2Sync(config.clientSecret, config.clientID, 100000, 16, "sha512").toString("hex");
const iv = config.encryptionIv;
module.exports.encrypt = function (data) {
    let cipher = createCipheriv("aes256", password, iv);
    let encrypt = cipher.update(data, "utf8", "hex");
    encrypt += cipher.final("hex");
    return encrypt;
};
module.exports.decrypt = function (data) {
    let decipher = createDecipheriv("aes256", password, iv);
    let decrypt = decipher.update(data, "hex", "utf8");
    decrypt += decipher.final("utf8");
    return decrypt;
};