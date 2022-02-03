"use strict";
const { Locale } = require("sosamba");
const FormatJSFormatter = require("./FormatJSFormatter");

class FormatJSLocale extends Locale {
    formatter = new FormatJSFormatter(this);

    constructor(sosamba, fileName, ...args) {
        super(sosamba, fileName, ...args, {
            name: fileName.replace(/\.json$/, ""),
        });
    }
}

module.exports = FormatJSLocale;
