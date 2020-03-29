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
(function (w) {
    const langMap = {
        "en-US": "en",
        "en": "en",
        "cs": "cs-CZ",
        "cs-CZ": "cs-CZ",
        "sk": "sk-SK",
        "sk-SK": "sk-SK",
        "ro": "ro-RO",
        "ro-RO": "ro-RO"
    };
    w.addEventListener("load", () => {
        const autofillButton = document.querySelector("button#autofill");
        const saveButton = document.querySelector("button#save");
        const localeSelector = document.querySelector("select#tttie-profile-locale");
        const timezoneField = document.querySelector("input#tttie-profile-tz");

        autofillButton.addEventListener("click", () => {
            const info = Intl.DateTimeFormat().resolvedOptions();
            const lang = Object.prototype.hasOwnProperty.call(langMap, info.locale) ? langMap[info.locale] : "en";
            const locales = localeSelector.querySelectorAll("option");
            for (const locale of locales) {
                if (locale.value === lang) {
                    locale.selected = true;
                    break;
                }
            }

            timezoneField.value = info.timeZone;
        });
        saveButton.addEventListener("click", () => {
            saveButton.disabled = true;
            saveButton.classList.add("is-loading");
            const d = {
                timezone: timezoneField.value
            };
            const locales = localeSelector.querySelectorAll("option");
            for (const locale of locales) {
                if (locale.selected) {
                    d.locale = locale.value;
                    break;
                }
            }

            w.ttbot.updateProfile(d).then(() => {
                w.location.reload();
            });
        });
    });
})(window);