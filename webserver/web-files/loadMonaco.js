"use strict";
(function (w) {
    w.__loadMonaco = function (cb) {
        require.config({paths: { vs: "/monaco/vs"}});
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