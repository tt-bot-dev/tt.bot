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

(function (win) {

    function loadPickers(isChannel, channel) {
        return element => {
            element.innerHTML = ""; // clear out lazy loading
            element.disabled = false;
            const noneSel = document.createElement("option");
            noneSel.value = "";
            noneSel.innerText = "None";
            noneSel.selected = true;
            element.appendChild(noneSel);
            channel.forEach(chan => {
                const select = document.createElement("option");
                select.value = chan.id;
                select.innerText = (isChannel ? "#" : "") + chan.name;
                element.appendChild(select);
            });
        };
    }
    function dataCollector(cb) {
        const prefix = document.querySelector("#tttie-dash-p").value;
        let modRole;
        for (const opt of document.querySelectorAll("select.tttie-dashboard-role-picker#tttie-dash-mod option")) if (opt.selected === true) modRole = opt.value;
        const farewellMessage = document.querySelector("#tttie-dash-fm").value;
        const logEvents = document.querySelector("#tttie-dash-le").value;
        let farewellChannelId;
        for (const opt of document.querySelectorAll("select.tttie-dashboard-channel-picker#tttie-dash-fc option")) if (opt.selected === true) farewellChannelId = opt.value;
        const greetingMessage = document.querySelector("#tttie-dash-wm").value;
        let greetingChannelId;
        for (const opt of document.querySelectorAll("select.tttie-dashboard-channel-picker#tttie-dash-wc option")) if (opt.selected === true) greetingChannelId = opt.value;
        let agreeChannel;
        for (const opt of document.querySelectorAll("select.tttie-dashboard-channel-picker#tttie-dash-ac option")) if (opt.selected === true) agreeChannel = opt.value;
        let memberRole;
        for (const opt of document.querySelectorAll("select.tttie-dashboard-role-picker#tttie-dash-mr option")) if (opt.selected === true) memberRole = opt.value;
        let logChannel;
        for (const opt of document.querySelectorAll("select.tttie-dashboard-channel-picker#tttie-dash-loc option")) if (opt.selected === true) logChannel = opt.value;
        let modlogChannel;
        for (const opt of document.querySelectorAll("select.tttie-dashboard-channel-picker#tttie-dash-ml option")) if (opt.selected === true) modlogChannel = opt.value;
        let locale;
        for (const opt of document.querySelectorAll("select#tttie-dash-locale option")) if (opt.selected === true) locale = opt.value;
        cb({
            prefix,
            modRole,
            farewellMessage,
            farewellChannelId,
            greetingMessage,
            greetingChannelId,
            agreeChannel,
            memberRole,
            logEvents,
            logChannel,
            modlogChannel,
            locale
        });
    }
    function setValues(cfg) {
        const inputP = document.querySelector("#tttie-dash-p");
        const inputFm = document.querySelector("#tttie-dash-fm");
        const inputMod = document.querySelector("#tttie-dash-mod");
        const inputWm = document.querySelector("#tttie-dash-wm");
        const inputLe = document.querySelector("#tttie-dash-le");
        const inputMl = document.querySelector("#tttie-dash-ml");
        const inputAc = document.querySelector("#tttie-dash-ac");
        const inputWc = document.querySelector("#tttie-dash-wc");
        const inputFc = document.querySelector("#tttie-dash-fc");
        const inputMr = document.querySelector("#tttie-dash-mr");
        const inputLc = document.querySelector("#tttie-dash-loc");
        const inputLocale = document.querySelector("#tttie-dash-locale");
        inputP.value = cfg.prefix || "";
        inputFm.value = cfg.farewellMessage || "";
        inputWm.value = cfg.greetingMessage || "";
        inputLe.value = cfg.logEvents || "";
        for (const opt of inputFc.querySelectorAll("option")) {
            if (opt.value === cfg.farewellChannelId) {
                opt.selected = true;
                break;
            }
        }
        for (const opt of inputWc.querySelectorAll("option")) {
            if (opt.value === cfg.greetingChannelId) {
                opt.selected = true;
                break;
            }
        }
        for (const opt of inputAc.querySelectorAll("option")) {
            if (opt.value === cfg.agreeChannel) {
                opt.selected = true;
                break;
            }
        }
        for (const opt of inputLc.querySelectorAll("option")) {
            if (opt.value === cfg.logChannel) {
                opt.selected = true;
                break;
            }
        }
        for (const opt of inputMr.querySelectorAll("option")) {
            if (opt.value === cfg.memberRole) {
                opt.selected = true;
                break;
            }
        }
        for (const opt of inputMod.querySelectorAll("option")) {
            if (opt.value === cfg.modRole) {
                opt.selected = true;
                break;
            }
        }
        for (const opt of inputMl.querySelectorAll("option")) {
            if (opt.value === cfg.modlogChannel) {
                opt.selected = true;
                break;
            }
        }
        for (const opt of inputLocale.querySelectorAll("option")) {
            if (opt.value === cfg.locale) {
                opt.selected = true;
                break;
            }
        }
        inputP.parentElement.classList.remove("is-loading");
        inputP.disabled = false;
        inputMod.parentElement.classList.remove("is-loading");
        inputMod.disabled = false;
        inputMl.parentElement.classList.remove("is-loading");
        inputMl.disabled = false;
        inputFm.parentElement.classList.remove("is-loading");
        inputFm.disabled = false;
        inputWm.parentElement.classList.remove("is-loading");
        inputWm.disabled = false;
        inputAc.parentElement.classList.remove("is-loading");
        inputAc.disabled = false;
        inputWc.parentElement.classList.remove("is-loading");
        inputWc.disabled = false;
        inputFc.parentElement.classList.remove("is-loading");
        inputFc.disabled = false;
        inputLe.parentElement.classList.remove("is-loading");
        inputLe.disabled = false;
        inputLc.parentElement.classList.remove("is-loading");
        inputLc.disabled = false;
        inputMr.parentElement.classList.remove("is-loading");
        inputMr.disabled = false;
        inputLocale.parentElement.classList.remove("is-loading");
        inputLocale.disabled = false;
    }

    window.addEventListener("load", () => {
        const pickers = document.querySelectorAll("select.tttie-dashboard-channel-picker");
        const rPickers = document.querySelectorAll("select.tttie-dashboard-role-picker:not(.no-role-hierarchy)");
        const pickersWithoutRoleHierarchy = document.querySelectorAll("select.tttie-dashboard-role-picker.no-role-hierarchy");
        win.ttbot.bindToSaveButton(document.querySelector("button#save"), setValues, dataCollector);
        win.ttbot.bindToResetButton(document.querySelector("button#reset"), setValues);
        win.ttbot.getAvailableChannels().then(c => {
            pickers.forEach(loadPickers(true, c));
            return win.ttbot.getAvailableRoles();
        }).then(r => {
            rPickers.forEach(loadPickers(false,
                r.filter(r => r.id !== win.ttbot.guildId)
            ));
            return win.ttbot.getAvailableRoles(true);
        }).then(r => {
            pickersWithoutRoleHierarchy.forEach(
                loadPickers(false, r.filter(r => r.id !== win.ttbot.guildId))
            );
        }).then(() => {
            win.ttbot.getConfig().then(setValues);
        });
    });
})(window);
