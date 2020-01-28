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
            }
            const locales = localeSelector.querySelectorAll("option");
            for (const locale of locales) {
                if (locale.selected) {
                    d.locale = locale.value;
                    break;
                }
            };

            w.ttbot.updateProfile(d).then(() => {
                w.location.reload();
            });
        });
    });
})(window);