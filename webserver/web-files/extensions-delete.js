"use strict";
(function (w) {
    const deleteButton = document.querySelector("a.tttie-linkbutton#delete");
    const checkbox = document.querySelector("input#tttie-delete-store");
    deleteButton.addEventListener("click", e => {
        e.preventDefault();
        w.ttbot.deleteExtension(checkbox.checked).then(() => {
            window.location = `/dashboard/${w.ttbot.guildId}/extensions`;
        });
    });
})(window);