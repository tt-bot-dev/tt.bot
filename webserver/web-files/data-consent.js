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
(function() {
    const createCookieConsent = () => {
        const cookieConsentEl = document.createElement("section");
        cookieConsentEl.className = "box is-marginless is-radiusless";
        const container = document.createElement("div");
        container.className = "container";
        const level = document.createElement("div");
        level.className = "level";
        const levelLeft = document.createElement("div");
        levelLeft.className = "level-left";
        const levelLeftItem = document.createElement("div");
        levelLeftItem.className = "level-item";
        const paragraph = document.createElement("p");
        paragraph.innerHTML = "We make use of cookies in order to provide tt.bot's web panel. <a href=\"https://tttie.cz/privacy/tt.bot.html\">Learn more</a>";

        const levelRight = document.createElement("div");
        levelRight.className = "level-right";
        const levelRightItem = document.createElement("div");
        levelRightItem.className = "level-item";
        const buttons = document.createElement("div");
        buttons.className = "buttons";

        const buttonYes = document.createElement("button");
        buttonYes.className = "button is-primary";
        const buttonYesIconSpan = document.createElement("span");
        buttonYesIconSpan.className = "icon";
        const buttonYesIcon = document.createElement("i");
        buttonYesIcon.className = "fas fa-check";
        const buttonYesSpan = document.createElement("span");
        buttonYesSpan.innerText = "OK";

        buttonYes.addEventListener("click", () => {
            localStorage.setItem("tt.bot::hasConsentedToCookies", "true");
            cookieConsentEl.remove();
        });

        const buttonNo = document.createElement("button");
        buttonNo.className = "button is-danger";
        const buttonNoIconSpan = document.createElement("span");
        buttonNoIconSpan.className = "icon";
        const buttonNoIcon = document.createElement("i");
        buttonNoIcon.className = "fas fa-times";
        const buttonNoSpan = document.createElement("span");
        buttonNoSpan.innerText = "No";

        buttonNo.addEventListener("click", () => {
            window.history.back();
        });


        buttonNoIconSpan.append(buttonNoIcon);
        buttonNo.append(buttonNoIconSpan, buttonNoSpan);
        buttonYesIconSpan.append(buttonYesIcon);
        buttonYes.append(buttonYesIconSpan, buttonYesSpan);
        buttons.append(buttonYes, buttonNo);

        levelRightItem.append(buttons);
        levelRight.append(levelRightItem);
        levelLeftItem.append(paragraph);
        levelLeft.append(levelLeftItem);
        level.append(levelLeft, levelRight);

        container.append(level);
        cookieConsentEl.append(container);
        document.body.prepend(cookieConsentEl);
    };

    window.addEventListener("load", function () {
        if (!localStorage.getItem("tt.bot::hasConsentedToCookies")) {
            createCookieConsent();                    
        }
        const yesButton = document.querySelector("#yes");
        const noButton = document.querySelector("#no");
        function accept() {
            window.location = "/acceptcookie"; 
        }
        function deny() {
            window.location = "https://google.com";
        }
        yesButton.addEventListener("click", accept);
        noButton.addEventListener("click", deny);
    });
})();
