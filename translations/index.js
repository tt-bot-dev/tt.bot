const fs = require("fs");
const rld = require("require-reload")(require);
module.exports = class Translations {
    constructor() {
        this._locales = {};
        let files = fs.readdirSync(`${__dirname}/locales`);
        files.forEach(i => {
            try {
                if (i.endsWith(".js")) {
                    this._locales[i.substring(0, i.indexOf(".js"))] = require(`${__dirname}/locales/${i}`);
                    console.log(`Loading translation file ${i}`);
                }
            } catch (err) {
                console.error(`Error while parsing JSON of ${i}`);
            }
        });
    }
    unload(lang) {
        if (this._locales[lang]) delete this._locales[lang];
        else throw new Error("The translation is nonexistant");
    }
    reload(lang) {
        if (this._locales[lang]) this._locales[lang] = rld(`${__dirname}/locales/${lang}`);
        else throw new Error("The translation is nonexistant");
    }
    getTranslationString(lang, context) {
        if (!(this._locales[lang] ? this._locales[lang][context] : this._locales["en"][context])) throw new Error("That definition doesn't exist.");
        return this._locales[lang]  ? this._locales[lang][context] : this._locales["en"][context];
    }
    checkLanguage(lang) {
        return this._locales[lang] !== undefined;
    }
};