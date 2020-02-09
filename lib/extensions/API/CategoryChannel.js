"use strict";
const {Collection} = require("eris");
const { TextChannel: tc, NewsChannel, VoiceChannel: vc} = require("sosamba").Eris;
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
                    if ((c instanceof tc) || (c instanceof NewsChannel)) coll.add(new TextChannel(extension, c));
                    else if (c instanceof vc) coll.add(new VoiceChannel(extension, c));
                    else coll.add(new Channel(extension, c));
                });
                return coll;
            }
        });
    }
}

module.exports = CategoryChannel;