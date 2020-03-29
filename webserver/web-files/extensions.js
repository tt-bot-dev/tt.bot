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
    const flagMapping = {
        httpRequests: 1,
        guildSettings: 1 << 1,
        dangerousGuildSettings: 1 << 2,
        guildModerative: 1 << 3,
        guildMembersMeta: 1 << 4,
        mentionEveryone: 1 << 5
    };
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

            let flagNum = 0;
            document.querySelectorAll("input.tttie-extension-flags")
                .forEach(box => {
                    if (Object.prototype.hasOwnProperty.call(flagMapping, box.id) && box.checked) {
                        flagNum |= flagMapping[box.id];
                    }
                });

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
                store: store.value || null,
                flags: flagNum
            });
        }
        function setValues(cfg, reset, update) {

            if (!reset && !update) {
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

            const flagBoxes = document.querySelectorAll("input.tttie-extension-flags");

            const isPendingApprovalTags = document.createElement("span");
            isPendingApprovalTags.classList.add("tags", "has-addons", "is-inline-flex", "requires-approval");
            const pendingApprovalTag = document.createElement("span");
            pendingApprovalTag.classList.add("tag", "is-info", "is-marginless");
            pendingApprovalTag.innerText = "Pending approval";
            const loadingTag = document.createElement("span");
            loadingTag.classList.add("tag", "is-info", "is-marginless", "is-loading");
            isPendingApprovalTags.append(pendingApprovalTag, loadingTag);

            for (const box of flagBoxes) {
                const loadingSelector = box.parentElement.parentElement.querySelector("span.tags.requires-approval");
                if (Object.prototype.hasOwnProperty.call(flagMapping, box.id)) {
                    if (cfg.flags & flagMapping[box.id]) {
                        box.checked = true;
                        if (loadingSelector) loadingSelector.remove();
                    }
                    else if (cfg.privilegedFlags & flagMapping[box.id]) {
                        box.checked = true;
                        if (!loadingSelector) box.parentElement.insertAdjacentElement("afterend", isPendingApprovalTags.cloneNode(true));
                    } else {
                        box.checked = false;
                        if (loadingSelector) loadingSelector.remove();
                    }
                } else {
                    box.checked = false;
                    if (loadingSelector) loadingSelector.remove();
                }
            }


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
                setValues(cfg, true);
            });
        });
    });

})(window);
