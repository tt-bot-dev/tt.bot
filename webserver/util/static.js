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
const { promises } = require("fs");
const { lookup } = require("mime-types");


module.exports = (polka, root) => async (rq, rs, nx) => {
    if (rs.finished || rs.writableEnded) return;
    const path = `${root}/${rq.path}`;
    let stat;
    try {
        stat = await promises.stat(path);
    } catch {
        polka.onNoMatch(rq, rs, nx);
        return;
    }

    if (stat.isDirectory()) {
        try {
            await promises.stat(`${path}/index.html`);
        } catch {
            polka.onNoMatch(rq, rs, nx);
            return;
        }
        rs.setHeader("Content-Type", "text/html,charset=utf-8");
        promises.readFile(`${path}/index.html`)
            .then(b => {
                rs.send(b);
            })
            .catch(e => {
                nx(e);
            });
    } else {
        const type = lookup(path) || "application/octet-stream";
        rs.setHeader("Content-Type", type);
        promises.readFile(path)
            .then(b => {
                rs.send(b);
            })
            .catch(e => {
                nx(e);
            });
    }
};