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
    };
    
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
})();