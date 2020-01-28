"use strict";
(function () {

    const doMenu = links => {
        for (const link of links) {
            if (window.location.pathname === "/") break;
            if (!link.href) continue;
            if (link.href === window.location.href) {
                link.classList.add("is-active");
                break;
            } else {
                link.classList.remove("is-active");
            }
        }
    }
    
    document.addEventListener("DOMContentLoaded", () => {
        const navbar = document.querySelector("nav.navbar");
        if (!navbar) return;
        const links = navbar.querySelectorAll("a.navbar-item");
        doMenu(links);
    
        const burger = navbar.querySelector("a.navbar-burger");
        if (!burger.dataset.target) return;
        burger.addEventListener("click", () => {
            const targetElement = document.getElementById(burger.dataset.target);
            burger.classList.toggle("is-active");
            targetElement.classList.toggle("is-active");
        });
    });
})()