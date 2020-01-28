"use strict";
(function (w) {
    const createDeleteModal = () => {
        const destroyModal = () => {
            modalCard.classList.remove("tttie-slide-in");
            modalCard.classList.add("tttie-slide-out");
            modalBg.classList.add("tttie-fade-out");
            modalCard.addEventListener("animationend", () => {
                modal.remove();
            }, {
                once: true
            });
        }
        const modal = document.createElement("div");
        modal.classList.add("modal", "is-active", "tttie-fade-in");

        const modalBg = document.createElement("div");
        modalBg.classList.add("modal-background");

        const modalCard = document.createElement("div");
        modalCard.classList.add("modal-card", "tttie-slide-in");

        const modalHeader = document.createElement("header");
        modalHeader.classList.add("modal-card-head");

        const modalHeaderLabel = document.createElement("p");
        modalHeaderLabel.classList.add("modal-card-title");
        modalHeaderLabel.innerText = "Please confirm the deletion of your profile";

        modalHeader.appendChild(modalHeaderLabel);

        const modalBody = document.createElement("section");
        modalBody.classList.add("modal-card-body");

        const modalBodyIrreversible = document.createElement("b");
        modalBodyIrreversible.innerText = "This action is irreversible!";
        modalBody.append(`Are you sure you want to delete your profile? `,
            modalBodyIrreversible
        );

        const modalFooter = document.createElement("footer");
        modalFooter.classList.add("modal-card-foot");

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("button", "is-danger");
        deleteButton.innerText = "Delete";
        deleteButton.addEventListener("click", () => {
            destroyModal();
            w.ttbot.deleteProfile().then(() => {
                w.location.assign("/");
            });
        });

        const cancelButton = document.createElement("button");
        cancelButton.classList.add("button");
        cancelButton.innerText = "Cancel";
        cancelButton.addEventListener("click", () => {
            destroyModal();
        })

        modalFooter.append(deleteButton, cancelButton);



        modalCard.append(modalHeader,
            modalBody,
            modalFooter);

        modal.append(modalBg,
            modalCard);

        document.body.appendChild(modal);
    }
    w.addEventListener("load", () => {
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
        const autofillButton = document.querySelector("button#autofill");
        const deleteButton = document.querySelector("button#delete");
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

        deleteButton.addEventListener("click", () => {
            createDeleteModal();
        })

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

            w.ttbot.updateProfile(d).then(p => {
                setVals(p);
                saveButton.classList.remove("is-loading");
                saveButton.disabled = false;
            });
        })

        const setVals = profile => {
            const locales = localeSelector.querySelectorAll("option");
            for (const locale of locales) {
                if (locale.value === profile.locale) {
                    locale.selected = true;
                    localeSelector.parentElement.classList.remove("is-loading");
                    break;
                }
            }
            timezoneField.value = profile.timezone;
            timezoneField.parentElement.classList.remove("is-loading");
        }

        w.ttbot.getProfile().then(setVals);
    })
})(window);