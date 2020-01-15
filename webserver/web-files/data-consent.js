"use strict";
window.onload = function () {
    const yesButton = document.querySelector("#yes");
    const noButton = document.querySelector("#no");
    function accept() { window.location = "/acceptcookie"; }
    function deny() {
        window.location = "https://google.com";
    }
    yesButton.addEventListener("click", accept);
    noButton.addEventListener("click", deny);
};