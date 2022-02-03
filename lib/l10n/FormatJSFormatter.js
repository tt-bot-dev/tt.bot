"use strict";
const { default: MessageFormat } = require("intl-messageformat");
const { LocaleFormatter } = require("sosamba");

class FormatJSFormatter extends LocaleFormatter {
    #precompiled = {};

    async formatTranslation(term, props) {
        if (!this.#precompiled[term]) this.#precompiled[term] = new MessageFormat(term, this.locale.id, undefined, { 
            ignoreTag: true,
        });

        return this.#precompiled[term].format(props);
    }
}

module.exports = FormatJSFormatter;
