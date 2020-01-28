"use strict";
const uglify = require("uglify-es");
const { readdirSync, readFileSync, writeFileSync } = require("fs");

for (const f of readdirSync(`${__dirname}/../webserver/web-files`, {
    withFileTypes: true
}).filter(f => f.isFile() && f.name.endsWith(".js"))) {
    const file = readFileSync(`${__dirname}/../webserver/web-files/${f.name}`);
    const o = uglify.minify(file.toString(), {
        compress: true,
        mangle: true,
        output: {
            ecma: 7
        }
    });
    if (o.error) {
        //eslint-disable-next-line no-console
        console.error(`Cannot minify ${f.name}:`);
        console.error(o.error);
        continue;
    }
    writeFileSync(`${__dirname}/../webserver/static/js/${f.name}`, o.code);
    //eslint-disable-next-line no-console
    console.log(`Minified ${f.name}`);
}