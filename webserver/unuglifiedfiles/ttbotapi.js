(function(w) {
    var ttbot = {};
    ttbot.guildId = null;
    ttbot.csrfToken = null;
    ttbot.guildConfig = null;
    ttbot.savingDashboardChanges = false;
    ttbot.saveDashboardChanges = function (data) {
        return fetch("/api/config/"+ttbot.guildId, {
            credentials: "include",
            body: JSON.stringify(data),
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "CSRF-Token": ttbot.csrfToken
            }
        }).then(function(r) {
            return r.json();
        }).then(function(j) {
            return ttbot.guildConfig = j;
        })
    }

    ttbot.bindToSaveButton = function (el, cb, dg) {
        el.addEventListener("click", function() {
            if (ttbot.savingDashboardChanges) return false;
            ttbot.savingDashboardChanges = true;
            var oldData = el.innerHTML;
            el.innerText = "Saving...";
            dg(function(d) {
                ttbot.saveDashboardChanges(d).then(function(){
                    el.innerHTML = oldData;
                    ttbot.savingDashboardChanges = false;
                    cb(ttbot.guildConfig)
                })
            })
        })
    }

    ttbot.bindToResetButton = function (el, cb) {
        el.addEventListener("click", function() {cb(ttbot.guildConfig)});
    }
    ttbot.getAvailableChannels = function () {
        return fetch("/api/channels/" + ttbot.guildId, {
            credentials: "include"
        }).then(function (r) {
            return r.json();
        })
    }
    ttbot.getAvailableRoles = function (ignoreHierarchy) {
        return fetch("/api/roles/" + ttbot.guildId + (ignoreHierarchy ? "?ignoreHierarchy=true" : ""), {
            credentials: "include"
        }).then(function (r) {
            return r.json();
        })
    }
    ttbot.getConfig = function() {
        return fetch("/api/config/" + ttbot.guildId, {
            credentials: "include"
        }).then(function (r) {
            return r.json();
        }).then(function(j) {
            return ttbot.guildConfig = j;
        })
    }

    ttbot.getExtension = function () {
        return fetch("/api/extensions/" + ttbot.guildId + "/" + ttbot.extension, {
            credentials: "include"
        }).then(function (r) {
            return r.json();
        }).then(function (e) {
            return ttbot.extensionData = e;
        })
    }

    ttbot.updateExtension = function (data) {
        return fetch("/api/extensions/" + ttbot.guildId + "/" + ttbot.extension, {
            credentials: "include",
            body: JSON.stringify(data),
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "CSRF-Token": ttbot.csrfToken
            }
        }).then(function(r) {
            return r.json();
        }).then(function(j) {
            return ttbot.extensionData = j;
        })
    }
    ttbot.deleteExtension = function (deleteStore) {
        return fetch("/api/extensions/" + ttbot.guildId + "/" + ttbot.extension, {
            credentials: "include",
            body: JSON.stringify({
                deleteStore: !!deleteStore  
            }),
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "CSRF-Token": ttbot.csrfToken
            }
        }).then(function(){return});
    }
    w.ttbot = ttbot;
})(window);