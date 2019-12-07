"use strict";
const { Event } = require("sosamba");

class WarnEvent extends Event {
    constructor(...args) {
        super(...args, {
            name: "warn"
        });
    }
    async run(...args) {
        this.log.warn(...args);
    }
}

module.exports = WarnEvent;