/**
 * Copyright (C) 2020 tt.bot dev team
 * 
 * This file is part of tt.bot.
 * 
 * tt.bot is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * tt.bot is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with tt.bot.  If not, see <http://www.gnu.org/licenses/>.
 */

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