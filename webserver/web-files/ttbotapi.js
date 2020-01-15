"use strict";
(function(w) {
    var ttbot = {};
    ttbot.guildId = null;
    ttbot.csrfToken = null;
    ttbot.guildConfig = null;
    ttbot.savingDashboardChanges = false;
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
            var oldData = element.innerHTML;
            element.innerText = "Saving...";
            dataGetter(data => {
                ttbot.saveDashboardChanges(data).then(() => {
                    element.innerHTML = oldData;
                    ttbot.savingDashboardChanges = false;
                    cb(ttbot.guildConfig);
                });
            });
        });
    };

    ttbot.bindToResetButton = (element, cb) => {
        element.addEventListener("click", () =>{
            cb(ttbot.guildConfig);
        });
    };
    ttbot.getAvailableChannels = () =>  {
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

    ttbot.getExtension = () => {
        return fetch(`/api/extensions/${ttbot.guildId}/${ttbot.extension}`, {
            credentials: "include"
        }).then(r => r.json()).then(e => ttbot.extensionData = e);
    };

    ttbot.updateExtension = data => {
        return fetch(`/api/extensions/${ttbot.guildId}/${ttbot.extension}`, {
            credentials: "include",
            body: JSON.stringify(data),
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "CSRF-Token": ttbot.csrfToken
            }
        }).then(r => r.json()).then(j => ttbot.extensionData = j);
    };
    ttbot.deleteExtension = function (deleteStore) {
        return fetch(`/api/extensions/${ttbot.guildId}/${ttbot.extension}`, {
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
    w.ttbot = ttbot;
})(window);