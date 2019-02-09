(function (w) {
    require.config({paths: { vs: "/monaco/vs"}});
    require(['vs/editor/editor.main'], function() {
        w.ttbot.monacoLoaded = true;
    });
})(window)