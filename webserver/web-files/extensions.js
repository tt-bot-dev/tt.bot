"use strict";
(function (w) {

    function loadPickers(isChannel, c) {
        return el => {
            el.innerHTML = "";
            const list = document.createElement("ul");
            list.className = "tttie-extension-list";
            c.forEach(c => {
                const li = document.createElement("li");
                const label = document.createElement("label");
                const input = document.createElement("input");
                input.id = c.id;
                input.type = "checkbox";
                input.name = isChannel ? "tttie-channels" : "tttie-roles";
                label.htmlFor = c.id;
                label.innerText = (isChannel ? "#" : "") + c.name;
                li.appendChild(input);
                li.appendChild(label);
                list.appendChild(li);
            });
            el.appendChild(list);
        };
    }

    let savingExtensionData = false;
    function bindToSaveButton (el, cb, dg) {
        el.addEventListener("click", () => {
            if (savingExtensionData) return false;
            savingExtensionData = true;
            var oldData = el.innerHTML;
            el.innerText = "Saving...";
            var oldExtData = w.ttbot.extensionData;
            dg(d => {
                const f = (failed, update) => {
                    el.innerHTML = oldData;
                    savingExtensionData = false;
                    cb(w.ttbot.extensionData, failed, update);
                };
                if (d) w.ttbot.updateExtension(d).then(() => f(false, true))
                    .then(() => {
                        if (w.ttbot.extension === "new") w.location = "/dashboard/" + w.ttbot.guildId + "/extensions/" + w.ttbot.extensionData.id + (w.ttbot.editor ? "/monaco" : "");
                        else {
                            if (oldExtData.name !== w.ttbot.extensionData.name) w.location.reload();
                            else return;
                        }
                    });
                else f(true, false);
            });
        });
    }

    const bindToResetButton = (el, cb) => {
        el.addEventListener("click", () => { cb(w.ttbot.extensionData, true); });
    };

    function dg(cb) {
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

        const title = document.querySelector("h1#tttie-title");
        if (cfg.id === "new") title.innerText = "Create a new extension";
        else title.innerText = "Extension: " + cfg.name;

        const extName = document.querySelector("input#tttie-extension-name");
        extName.value = cfg.name;

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

        const commandTrigger = document.querySelector("input#tttie-extension-cmd");
        commandTrigger.value = cfg.commandTrigger;

        if (reset) {
            const ta = document.querySelector("textarea#tttie-textarea-code");
            if (!ta && document.querySelector("div.monaco-container#extension-monaco-container")) {
                w.ttbot.editor.setValue(cfg.code);
            } else {
                ta.value = cfg.code;
            }
        }
    }

    window.addEventListener("load", () => {
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

            const ta = document.querySelector("textarea#tttie-textarea-code");
            if (!ta && document.querySelector("div.monaco-container#extension-monaco-container")) {
                function loadEditor () {
                    fetch("/tt.bot.d.ts").then(r => r.text()).then(tsd => {
                        w.monaco.languages.typescript.javascriptDefaults.addExtraLib(tsd);
                        w.ttbot.editor = w.monaco.editor.create(document.querySelector("div.monaco-container#extension-monaco-container"), {
                            value: d.code,
                            language: "javascript",
                            theme: "vs-dark"
                        });
                        w.addEventListener("resize", function () {
                            w.ttbot.editor.layout({
                                height: 600,
                                width: document.body.clientWidth > 650 ? 650 : 350
                            });
                        });
                    });
                }
                const checkFunction = function () {
                    if (w.ttbot.monacoLoaded) return loadEditor();
                    setTimeout(checkFunction, 100);
                };
                if (w.ttbot.monacoLoaded) loadEditor();
                else setTimeout(checkFunction, 100);
            } else {
                ta.value = d.code;
            }
            setValues(d);
            bindToSaveButton(document.querySelector("a.tttie-linkbutton#save"), setValues, dg);
            bindToResetButton(document.querySelector("a.tttie-linkbutton#reset"), cfg => {
                setValues(cfg, true);
            });
        });
    });
})(window);
