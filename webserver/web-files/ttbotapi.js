"use strict";
(function (w) {
    const ttbot = (window.ttbot || (window.ttbot = {}));
    if (!ttbot.guildId) ttbot.guildId = null;
    if (!ttbot.csrfToken) ttbot.csrfToken = null;
    ttbot.guildConfig = null;
    ttbot.userProfile = null;
    ttbot.savingDashboardChanges = false;
    const fetch = (...args) => w.fetch(...args).then(commonErrorHandler);

    const commonErrorHandler = r => {
        if (!r.ok) {
            return r.text().then(text => {

                const destroyModal = () => {
                    modalCard.classList.remove("tttie-slide-in");
                    modalCard.classList.add("tttie-slide-out");
                    modalBg.classList.add("tttie-fade-out");
                    modalCard.addEventListener("animationend", () => {
                        modal.remove();
                    }, {
                        once: true
                    });
                };
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
                modalHeaderLabel.innerText = "An error has occured";

                modalHeader.appendChild(modalHeaderLabel);

                const modalBody = document.createElement("section");
                modalBody.classList.add("modal-card-body");

                const pre = document.createElement("pre");
                const code = document.createElement("code");
                code.innerText = text;
                pre.append(code);
                modalBody.append(`HTTP error ${r.status} ${r.statusText}:`,
                    document.createElement("br"),
                    "Request body:",
                    document.createElement("br"),
                    pre
                );

                const modalFooter = document.createElement("footer");
                modalFooter.classList.add("modal-card-foot");

                const cancelButton = document.createElement("button");
                cancelButton.classList.add("button");
                cancelButton.innerText = "Close";
                cancelButton.addEventListener("click", () => {
                    destroyModal();
                });

                modalFooter.append(cancelButton);


                modalCard.append(modalHeader,
                    modalBody,
                    modalFooter);

                modal.append(modalBg,
                    modalCard);

                document.body.appendChild(modal);
                const err = new Error();
                err.res = r;
                throw err;
            });
        } else {
            return r;
        }
    };
    ttbot.saveDashboardChanges = data => {
        return fetch(`/api/config/${ttbot.guildId}`, {
            credentials: "include",
            body: JSON.stringify(data),
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "CSRF-Token": ttbot.csrfToken
            }
        }).then(r => r.json()).then(j => ttbot.guildConfig = j);
    };

    ttbot.bindToSaveButton = (element, cb, dataGetter) => {
        element.addEventListener("click", () => {
            if (ttbot.savingDashboardChanges) return false;
            ttbot.savingDashboardChanges = true;
            element.classList.add("is-loading");
            element.disabled = true;
            dataGetter(data => {
                ttbot.saveDashboardChanges(data).then(() => {
                    element.classList.remove("is-loading");
                    element.disabled = false;
                    ttbot.savingDashboardChanges = false;
                    cb(ttbot.guildConfig);
                });
            });
        });
    };

    ttbot.bindToResetButton = (element, cb) => {
        element.addEventListener("click", () => {
            cb(ttbot.guildConfig);
        });
    };
    ttbot.getAvailableChannels = () => {
        return fetch(`/api/channels/${ttbot.guildId}`, {
            credentials: "include"
        }).then(r => r.json());
    };
    ttbot.getAvailableRoles = ignoreHierarchy => {
        return fetch(`/api/roles/${ttbot.guildId}` + (ignoreHierarchy ? "?ignoreHierarchy=true" : ""), {
            credentials: "include"
        }).then(r => r.json());
    };
    ttbot.getConfig = () => {
        return fetch(`/api/config/${ttbot.guildId}`, {
            credentials: "include"
        }).then(r => r.json()).then(j => ttbot.guildConfig = j);
    };

    ttbot.getExtension = (id = ttbot.extension) => {
        return fetch(`/api/extensions/${ttbot.guildId}/${id}`, {
            credentials: "include"
        }).then(r => r.json()).then(e => ttbot.extensionData = e);
    };

    ttbot.updateExtension = (data, id = ttbot.extension) => {
        return fetch(`/api/extensions/${ttbot.guildId}/${id}`, {
            credentials: "include",
            body: JSON.stringify(data),
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "CSRF-Token": ttbot.csrfToken
            }
        }).then(r => r.json()).then(j => ttbot.extensionData = j);
    };
    ttbot.deleteExtension = function (deleteStore, id = ttbot.extension) {
        return fetch(`/api/extensions/${ttbot.guildId}/${id}`, {
            credentials: "include",
            body: JSON.stringify({
                deleteStore: !!deleteStore
            }),
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "CSRF-Token": ttbot.csrfToken
            }
        }).then(() => undefined);
    };

    ttbot.getProfile = () => fetch("/api/profile", {
        credentials: "include"
    }).then(r => r.json()).then(p => {
        ttbot.csrfToken = p.csrfToken;
        delete p.csrfToken;
        return ttbot.userProfile = p;
    });

    ttbot.updateProfile = data => fetch("/api/profile", {
        credentials: "include",
        body: JSON.stringify(data),
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "CSRF-Token": ttbot.csrfToken
        }
    }).then(r => r.json()).then(p => ttbot.userProfile = p);

    ttbot.deleteProfile = () => fetch("/api/profile", {
        credentials: "include",
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "CSRF-Token": ttbot.csrfToken
        }
    }).then(() => undefined);
    
})(window);