if (global.i18n) t()
else setTimeout(i18nchecker, 100);

function i18nchecker() {
    if (!checkfori18n()) return setTimeout(i18nchecker, 100)
    t()
}

function checkfori18n() {
    return !!global.i18n
}


function t() {
    for (let key in i18n.languages["en"]) {
        if (!i18n.languages["en"].hasOwnProperty(key)) continue;
        module.exports[key] = key;
    }
}