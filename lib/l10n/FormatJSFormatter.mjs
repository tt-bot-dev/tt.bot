
import { IntlMessageFormat } from "intl-messageformat";
import { LocaleFormatter } from "sosamba";


class FormatJSFormatter extends LocaleFormatter {
    #precompiled = {};

    async formatTranslation(term, props) {
        if (!this.#precompiled[term]) this.#precompiled[term] = new IntlMessageFormat(term, this.locale.id, undefined, { 
            ignoreTag: true,
        });

        return this.#precompiled[term].format(props);
    }
}

export default FormatJSFormatter;
