const {Collection} = require("eris");
const Channel = require("./Channel");


class CategoryChannel extends Channel {
    constructor(channel) {
        super(channel);

        Object.defineProperty(this, "channels", {
            get: function () {
                const coll = new Collection(Channel);
                channel.channels.forEach(chan => {
                    coll.add(new Channel(chan));
                });
                return coll;
            }
        })
    }
}

module.exports = CategoryChannel;