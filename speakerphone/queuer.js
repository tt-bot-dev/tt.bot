const emitter = require("events").EventEmitter;
const e = require("./emitter")
module.exports = class Queuer extends emitter {
    constructor() {
        super()
        this._channels = [];

    }
    add(channel) {
        if (this._channels.includes(channel)) {
                this._channels = this._channels.filter(fn =>fn !=channel);
            return channel.createMessage(`Removed the channel from queue.`)
        }
        channel.createMessage("Please wait, until we find the other side.")
        this._channels.push(channel);
        if (this._channels.length >= 2) {
            let conn = new e(this._channels[0], this._channels[1])
            speakerPhoneBinds.binds[this._channels[0].id] = conn;
            speakerPhoneBinds.binds[this._channels[1].id] = conn;
            let newArray = this._channels.slice(2);
            this._channels = newArray;
            return conn;    


        }
    }
}