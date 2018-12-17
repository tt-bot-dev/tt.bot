(function (w) {

    function loadPickers(isChannel, c) {
        return function (el) {
            el.innerHTML = "";
            var list = document.createElement("ul");
            list.className = "tttie-extension-list";
            c.forEach(function (c) {
                var li = document.createElement("li");
                var label = document.createElement("label");
                var input = document.createElement("input");
                input.id = c.id;
                input.type = "checkbox";
                input.name = isChannel ? "tttie-channels" : "tttie-roles"
                label.htmlFor = c.id;
                label.innerText = (isChannel ? "#" : "") + c.name;
                li.appendChild(input);
                li.appendChild(label);
                list.appendChild(li);
            })
            el.appendChild(list);
        }
    }

    var savingExtensionData = false;
    var bindToSaveButton = function (el, cb, dg) {
        el.addEventListener("click", function () {
            if (savingExtensionData) return false;
            savingExtensionData = true;
            var oldData = el.innerHTML;
            el.innerText = "Saving...";
            var oldExtData = w.ttbot.extensionData;
            dg(function (d) {
                var f = function () {
                    el.innerHTML = oldData;
                    savingExtensionData = false;
                    cb(w.ttbot.extensionData)
                }
                if (d) w.ttbot.updateExtension(d).then(function(d) {
                    return f(d, false, true)
                }).then(function () {
                    if (w.ttbot.extension === "new") w.location = "/dashboard/" + w.ttbot.guildId + "/extensions/" + w.ttbot.extensionData.id + (w.ttbot.editor ? "/monaco" : "")
                    else {
                        if (oldExtData.name !== w.ttbot.extensionData.name) w.location.reload();
                        else return;
                    }
                })
                else f();
            })
        })
    }

    var bindToResetButton = function (el, cb) {
        el.addEventListener("click", function () { cb(w.ttbot.extensionData, true) });
    }

    function dg(cb) {
        var allowedChannels = []
        for (var picker of document.querySelectorAll("div.tttie-extension-channel-list")) {
            picker.querySelectorAll("input[name=\"tttie-channels\"]")
                .forEach(function (c) {
                    if (c.checked) allowedChannels.push(c.id);
                })
        }

        var allowedRoles = [];
        for (var picker of document.querySelectorAll("div.tttie-extension-role-list")) {
            picker.querySelectorAll("input[name=\"tttie-roles\"]")
                .forEach(function (c) {
                    if (c.checked) allowedRoles.push(c.id);
                })
        }

        var store = document.querySelector("input#tttie-extension-store-id");
        if (ttbot.extension !== "new" && !store.value) cb(false);

        var commandTrigger = document.querySelector("input#tttie-extension-cmd")
        if (!commandTrigger.value) cb(false);

        var code;
        var ta = document.querySelector("textarea#tttie-textarea-code");
        if (!ta && document.querySelector("div.monaco-container#extension-monaco-container")) {
            code = w.ttbot.editor.getValue();
        } else {
            code = ta.value;
        }

        var name = document.querySelector("input#tttie-extension-name");

        cb({
            allowedChannels: allowedChannels,
            allowedRoles: allowedRoles,
            commandTrigger: commandTrigger.value,
            code: code,
            name: name.value,
            store: store.value || null
        })
    }
    function setValues(cfg, reset, update) {

        if (!reset || !update) {
            if (cfg.id === "new") document.title += " - New extension"
            else document.title += " - Extension: " + cfg.name
        }

        var title = document.querySelector("h1#tttie-title");
        if (cfg.id === "new") title.innerText = "Create a new extension";
        else title.innerText = "Extension: " + cfg.name

        var extName = document.querySelector("input#tttie-extension-name");
        extName.value = cfg.name

        for (var picker of document.querySelectorAll("div.tttie-extension-channel-list")) {
            picker.querySelectorAll("input[name=\"tttie-channels\"]").forEach(function (c) {
                if (cfg.allowedChannels.includes(c.id)) c.checked = true;
                else c.checked = false;
            })
        }

        for (var picker of document.querySelectorAll("div.tttie-extension-role-list")) {
            picker.querySelectorAll("input[name=\"tttie-roles\"]").forEach(function (c) {
                if (cfg.allowedRoles.includes(c.id)) c.checked = true;
                else c.checked = false;
            })
        }

        var store = document.querySelector("input#tttie-extension-store-id");
        store.value = cfg.store;

        var commandTrigger = document.querySelector("input#tttie-extension-cmd")
        commandTrigger.value = cfg.commandTrigger

        if (reset) {
            var ta = document.querySelector("textarea#tttie-textarea-code");
            if (!ta && document.querySelector("div.monaco-container#extension-monaco-container")) {
                w.ttbot.editor.setValue(cfg.code);
            } else {
                ta.value = cfg.code;
            }
        }
    }

    window.addEventListener("load", function () {
        var pickers = document.querySelectorAll("div.tttie-extension-channel-list");
        var rPickers = document.querySelectorAll("div.tttie-extension-role-list");
        w.ttbot.getAvailableChannels().then(function (c) {
            pickers.forEach(loadPickers(true, c));
            return w.ttbot.getAvailableRoles(true)
        }).then(function (r) {
            rPickers.forEach(loadPickers(false, r.filter(function (r) {
                return r.id !== w.ttbot.guildId;
            })));
            return w.ttbot.getExtension()
        }).then(function (d) {

            var ta = document.querySelector("textarea#tttie-textarea-code");
            if (!ta && document.querySelector("div.monaco-container#extension-monaco-container")) {
                var loadEditor = function () {
                    fetch("/tt.bot.d.ts").then(function (r) {
                        return r.text();
                    }).then(function (tsd) {
                        console.log(tsd);
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
                        })
                    })
                }
                var checkFunction = function () {
                    if (w.ttbot.monacoLoaded) return loadEditor();
                    setTimeout(checkFunction, 100);
                }
                if (w.ttbot.monacoLoaded) loadEditor();
                else setTimeout(checkFunction, 100);
            } else {
                ta.value = d.code;
            }
            setValues(d);
            bindToSaveButton(document.querySelector("a.tttie-linkbutton#save"), setValues, dg);
            bindToResetButton(document.querySelector("a.tttie-linkbutton#reset"), function (cfg) {
                setValues(cfg, true)
            });
        })
    });
})(window);
