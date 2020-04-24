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

/* eslint-disable no-console */
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
        console.error(`Cannot minify ${f.name}:`);
        console.error(o.error);
        continue;
    }
    writeFileSync(`${__dirname}/../webserver/static/js/${f.name}`, o.code);
    console.log(`Minified ${f.name}`);
}