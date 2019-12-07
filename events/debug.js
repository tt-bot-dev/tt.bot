"use strict";
const { Event } = require("sosamba");

class DebugEvent extends Event {
    constructor(...args) {
        super(...args, {
            name: "debug"
        });
    }
    async run(...args) {
        this.log.debug(...args);
    }
}

module.exports = DebugEvent;