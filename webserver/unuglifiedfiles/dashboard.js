(function (w) {

    function loadPickers(isChannel, c) {
        return function (el) {
            el.innerHTML = ""; // clear out lazy loading...
            el.disabled = false;
            var noneSel = document.createElement("option");
            noneSel.value = "";
            noneSel.innerText = "None";
            noneSel.selected = true;
            el.appendChild(noneSel);
            c.forEach(function (c) {
                var select = document.createElement("option");
                select.value = c.id;
                select.innerText = (isChannel ? "#" : "") + c.name;
                el.appendChild(select);
            })
        }
    }
    function dg(cb) {
        var p = document.querySelector("#tttie-dash-p").value;
        var m = document.querySelector("#tttie-dash-mod").value;
        var fm = document.querySelector("#tttie-dash-fm").value;
        var le = document.querySelector("#tttie-dash-le").value;
        var fc;
        for (var opt of document.querySelectorAll("select.tttie-dashboard-channel-picker#tttie-dash-fc option")) if (opt.selected == true) fc = opt.value;
        var wm = document.querySelector("#tttie-dash-wm").value;
        var wc;
        for (var opt of document.querySelectorAll("select.tttie-dashboard-channel-picker#tttie-dash-wc option")) if (opt.selected == true) wc = opt.value;
        for (var opt of document.querySelectorAll("select.tttie-dashboard-channel-picker#tttie-dash-ac option")) if (opt.selected == true) ac = opt.value;
        var mr;
        for (var opt of document.querySelectorAll("select.tttie-dashboard-role-picker#tttie-dash-mr option")) if (opt.selected == true) mr = opt.value
        var loc;
        for (var opt of document.querySelectorAll("select.tttie-dashboard-channel-picker#tttie-dash-loc option")) if (opt.selected == true) loc = opt.value
        var ml;
        for (var opt of document.querySelectorAll("select.tttie-dashboard-channel-picker#tttie-dash-ml option")) if (opt.value === cfg.modlogChannel) ml = opt.value;
        cb({
            prefix: p,
            modRole: m,
            farewellMessage: fm,
            farewellChannelId: fc,
            greetingMessage: wm,
            greetingChannelId: wc,
            agreeChannel: ac,
            memberRole: mr,
            logEvents: le,
            logChannel: loc,
            modlogChannel: ml
        });
    }
    function setValues(cfg) {
        var inputP = document.querySelector("#tttie-dash-p");
        var inputMod = document.querySelector("#tttie-dash-mod");
        var inputFm = document.querySelector("#tttie-dash-fm");
        var inputWm = document.querySelector("#tttie-dash-wm");
        var inputLe = document.querySelector("#tttie-dash-le");
        var channelInputs = document.querySelectorAll("select.tttie-dashboard-channel-picker > option");
        var roleInputs = document.querySelectorAll("select.tttie-dashboard-role-picker > option");
        var selectedChannelInputs = [];
        var selectedRoleInputs = [];
        inputP.value = cfg.prefix || "";
        inputMod.value = cfg.modRole || "";
        inputFm.value = cfg.farewellMessage || "";
        inputWm.value = cfg.greetingMessage || "";
        inputLe.value = cfg.logEvents || "";
        for (var opt of document.querySelectorAll("select.tttie-dashboard-channel-picker#tttie-dash-fc option")) if (opt.value === cfg.farewellChannelId) opt.selected = true;
        for (var opt of document.querySelectorAll("select.tttie-dashboard-channel-picker#tttie-dash-wc option")) if (opt.value === cfg.greetingChannelId) opt.selected = true;
        for (var opt of document.querySelectorAll("select.tttie-dashboard-channel-picker#tttie-dash-ac option")) if (opt.value === cfg.agreeChannel) opt.selected = true;
        for (var opt of document.querySelectorAll("select.tttie-dashboard-channel-picker#tttie-dash-loc option")) if (opt.value === cfg.logChannel) opt.selected = true;
        for (var opt of document.querySelectorAll("select.tttie-dashboard-role-picker#tttie-dash-mr option")) if (opt.value === cfg.memberRole) opt.selected = true;
        for (var opt of document.querySelectorAll("select.tttie-dashboard-channel-picker#tttie-dash-ml option")) if (opt.value === cfg.modlogChannel) opt.selected = true;
        inputP.disabled = false;
        inputMod.disabled = false;
        inputFm.disabled = false;
        inputWm.disabled = false;
        inputLe.disabled = false;
    }

    window.addEventListener("load", function () {
        var pickers = document.querySelectorAll("select.tttie-dashboard-channel-picker");
        var rPickers = document.querySelectorAll("select.tttie-dashboard-role-picker");
        w.ttbot.bindToSaveButton(document.querySelector("a.tttie-linkbutton#save"), setValues, dg);
        w.ttbot.bindToResetButton(document.querySelector("a.tttie-linkbutton#reset"), setValues);
        w.ttbot.getAvailableChannels().then(function (c) {
            pickers.forEach(loadPickers(true, c));
            return w.ttbot.getAvailableRoles()
        }).then(function (r) {
            rPickers.forEach(loadPickers(false, r.filter(function (r) {
                return r.id !== w.ttbot.guildId;
            })));
        }).then(function () {
            w.ttbot.getConfig().then(setValues);
        });
    });
})(window);
