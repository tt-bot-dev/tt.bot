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
const { Collection } = require("eris");
const { TextChannel: tc, NewsChannel, VoiceChannel: vc } = require("sosamba").Eris;
const Channel = require("./Channel");
const TextChannel = require("./TextChannel");
const VoiceChannel = require("./VoiceChannel");


class CategoryChannel extends Channel {
    constructor(extension, channel) {
        super(extension, channel);

        Object.defineProperty(this, "channels", {
            get: function () {
                const coll = new Collection(Channel);
                channel.channels.forEach(c => {
                    if (c instanceof tc || c instanceof NewsChannel) coll.add(new TextChannel(extension, c));
                    else if (c instanceof vc) coll.add(new VoiceChannel(extension, c));
                    else coll.add(new Channel(extension, c));
                });
                return coll;
            }
        });
    }
}

module.exports = CategoryChannel;