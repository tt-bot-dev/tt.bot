/**
 * Copyright (C) 2021 tt.bot dev team
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
    w.__loadMonaco = function (cb) {
        require.config({ paths: { vs: "/monaco/vs" } });
        require(["vs/editor/editor.main"], function() {
            fetch("/tt.bot.d.ts").then(r => r.text()).then(def => {
                w.monaco.languages.typescript.javascriptDefaults.addExtraLib(def);
                w.ttbot.editor = w.monaco.editor.create(document.querySelector("div.monaco-container#extension-monaco-container"), {
                    language: "javascript",
                    theme: "vs-dark",
                });
                w.addEventListener("resize", function () {
                    w.ttbot.editor.layout();
                });
                cb();
            });
        });
    };
})(window);