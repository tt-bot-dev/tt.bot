"use strict";
const uglify = require("uglify-es");
const { readFileSync, writeFileSync } = require("fs");

for (const f of ["dashboard.js",
    "data-consent.js",
    "extensions-delete.js",
    "extensions.js",
    "loadMonaco.js",
    "ttbotapi.js"]) {
    const file = readFileSync(`${__dirname}/../webserver/web-files/${f}`);
    const o = uglify.minify(file.toString(), {
        compress: true,
        mangle: true,
        output: {
            ecma: 7
        }
    });
    writeFileSync(`${__dirname}/../webserver/static/js/${f}`, o.code);
    //eslint-disable-next-line no-console
    console.log(`Minified ${f}`);
}