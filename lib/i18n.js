"use strict";
const fs = require("fs");
class I18N {
    constructor(bot) {
        this.bot = bot;
        this.languages = {};

        // Using sync here is okay
        const files = fs.readdirSync(`${__dirname}/../languages`);
        files.forEach(e => {
            if (/.+\.js$/.test(e)) {
                const translation = require(`${__dirname}/../languages/${e}`);
                this.languages[e.replace(/\.js$/, "")] = translation;
            }
        });
    }

    getTranslation(term, lang, ...args) {
        const l = this.languages[lang];
        if (!l) throw new Error("Unknown language");
        const tr = l[term.toUpperCase()];
        if (!tr && l.fallbackLanguage) {
            return this.getTranslation(term, l.fallbackLanguage, ...args);
        } else if (!tr) return "Unknown term";
        if (typeof tr === "string") return tr;
        return tr(...args);
    }

    reloadLang(lang) {
        if (!this.languages[lang]) throw new Error("Unknown language");
        delete require.cache[require.resolve(`${__dirname}/../languages/${lang}.js`)];
        this.languages[lang] = require(`${__dirname}/../languages/${lang}.js`);
    }
}

module.exports = I18N;