(function (w) {
    var deleteButton = document.querySelector("a.tttie-linkbutton#delete");
    var checkbox = document.querySelector("input#tttie-delete-store");
    deleteButton.addEventListener("click", function (e) {
        e.preventDefault();
        w.ttbot.deleteExtension(checkbox.checked).then(function () {
            window.location = "/dashboard/" + w.ttbot.guildId + "/extensions"
        })
    })
})(window)