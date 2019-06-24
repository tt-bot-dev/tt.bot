const {Collection} = require("eris");
const { TextChannel: tc, VoiceChannel: vc} = require("sosamba").Eris;
const Channel = require("./Channel");


class CategoryChannel extends Channel {
    constructor(extension, channel) {
        super(extension, channel);

        Object.defineProperty(this, "channels", {
            get: function () {
                const coll = new Collection(Channel);
                channel.channels.forEach(c => {
                    if (c instanceof tc) coll.add(new TextChannel(extension, c));
                    if (c instanceof vc) coll.add(new VoiceChannel(extension, c));
                });
                return coll;
            }
        })
    }
}

module.exports = CategoryChannel;