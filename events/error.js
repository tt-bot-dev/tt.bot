"use strict";
const { Event } = require("sosamba");

class ErrorEvent extends Event {
    constructor(...args) {
        super(...args, {
            name: "error"
        });
    }
    async run(...args) {
        this.log.error(...args);
    }
}

module.exports = ErrorEvent;