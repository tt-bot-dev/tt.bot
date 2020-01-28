"use strict";
(function (w) {
    (w.__loadMonaco || (cb => w.addEventListener("load", cb)))(function () {
        function loadPickers(isChannel, c) {
            return el => {
                el.innerHTML = "";
                c.forEach(c => {
                    const list = document.createElement("div");
                    list.className = "control";
                    const label = document.createElement("label");
                    label.className = "checkbox";
                    const span = document.createElement("span");
                    const input = document.createElement("input");
                    input.id = c.id;
                    input.type = "checkbox";
                    input.name = isChannel ? "tttie-channels" : "tttie-roles";
                    span.innerText = (isChannel ? "#" : "") + c.name;
                    label.append(input, span);
                    list.appendChild(label);
                    el.appendChild(list);
                });
            };
        }

        let savingExtensionData = false;
        function bindToSaveButton(el, cb, dg) {
            el.addEventListener("click", () => {
                if (savingExtensionData) return false;
                savingExtensionData = true;
                el.classList.add("is-loading");
                el.disabled = true;
                const oldExtData = w.ttbot.extensionData;
                dg(data => {
                    const _cb = (failed, update) => {
                        el.classList.remove("is-loading");
                        el.disabled = false;
                        savingExtensionData = false;
                        cb(w.ttbot.extensionData, failed, update);
                    };
                    if (data) w.ttbot.updateExtension(data).then(() => _cb(false, true))
                        .then(() => {
                            if (w.ttbot.extension === "new") w.location = "/dashboard/" + w.ttbot.guildId + "/extensions/" + w.ttbot.extensionData.id + (w.ttbot.editor ? "/monaco" : "");
                            else {
                                if (oldExtData.name !== w.ttbot.extensionData.name) w.location.reload();
                                else return;
                            }
                        });
                    else _cb(true, false);
                });
            });
        }

        const bindToResetButton = (el, cb) => {
            el.addEventListener("click", () => {
                cb(w.ttbot.extensionData, true);
            });
        };

        function dataCollector(cb) {
            const allowedChannels = [];
            for (const picker of document.querySelectorAll("div.tttie-extension-channel-list")) {
                picker.querySelectorAll("input[name=\"tttie-channels\"]")
                    .forEach(c => {
                        if (c.checked) allowedChannels.push(c.id);
                    });
            }

            const allowedRoles = [];
            for (var picker of document.querySelectorAll("div.tttie-extension-role-list")) {
                picker.querySelectorAll("input[name=\"tttie-roles\"]")
                    .forEach(c => {
                        if (c.checked) allowedRoles.push(c.id);
                    });
            }

            const store = document.querySelector("input#tttie-extension-store-id");
            if (ttbot.extension !== "new" && !store.value) cb(false);

            const commandTrigger = document.querySelector("input#tttie-extension-cmd");
            if (!commandTrigger.value || commandTrigger.value.includes(" ") || commandTrigger.value.length > 20) cb(false);

            let code;
            const ta = document.querySelector("textarea#tttie-textarea-code");
            if (!ta && document.querySelector("div.monaco-container#extension-monaco-container")) {
                code = w.ttbot.editor.getValue();
            } else {
                code = ta.value;
            }

            const name = document.querySelector("input#tttie-extension-name");
            if (!name.value || name.value.length > 100) cb(false);

            cb({
                allowedChannels: allowedChannels,
                allowedRoles: allowedRoles,
                commandTrigger: commandTrigger.value,
                code: code,
                name: name.value,
                store: store.value || null
            });
        }
        function setValues(cfg, reset, update) {

            if (!reset || !update) {
                if (cfg.id === "new") document.title += " - New extension";
                else document.title += " - Extension: " + cfg.name;
            }

            const titles = document.querySelectorAll(".tttie-title");
            for (const title of titles) {
                if (cfg.id === "new") title.innerText = "New extension";
                else title.innerText = cfg.name;
            }

            const extName = document.querySelector("input#tttie-extension-name");
            extName.value = cfg.name;
            extName.parentElement.classList.remove("is-loading");

            for (const picker of document.querySelectorAll("div.tttie-extension-channel-list")) {
                picker.querySelectorAll("input[name=\"tttie-channels\"]").forEach(c => {
                    if (cfg.allowedChannels.includes(c.id)) c.checked = true;
                    else c.checked = false;
                });
            }

            for (const picker of document.querySelectorAll("div.tttie-extension-role-list")) {
                picker.querySelectorAll("input[name=\"tttie-roles\"]").forEach(c => {
                    if (cfg.allowedRoles.includes(c.id)) c.checked = true;
                    else c.checked = false;
                });
            }

            const store = document.querySelector("input#tttie-extension-store-id");
            store.value = cfg.store;
            store.parentElement.classList.remove("is-loading");

            const commandTrigger = document.querySelector("input#tttie-extension-cmd");
            commandTrigger.value = cfg.commandTrigger;
            commandTrigger.parentElement.classList.remove("is-loading");

            const ta = document.querySelector("textarea#tttie-textarea-code");
            if (!ta && document.querySelector("div.monaco-container#extension-monaco-container")) {
                w.ttbot.editor.setValue(cfg.code);
            } else {
                ta.value = cfg.code;
                ta.parentElement.classList.remove("is-loading");
            }
        }

        const pickers = document.querySelectorAll("div.tttie-extension-channel-list");
        const rPickers = document.querySelectorAll("div.tttie-extension-role-list");
        w.ttbot.getAvailableChannels().then(c => {
            pickers.forEach(loadPickers(true, c));
            return w.ttbot.getAvailableRoles(true);
        }).then(r => {
            rPickers.forEach(loadPickers(false,
                r.filter(r => r.id !== w.ttbot.guildId)));
            return w.ttbot.getExtension();
        }).then(d => {
            setValues(d);
            bindToSaveButton(document.querySelector("button#save"), setValues, dataCollector);
            bindToResetButton(document.querySelector("button#reset"), cfg => {
                setValues(cfg);
            });
        });
    })

})(window);
