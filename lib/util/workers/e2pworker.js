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
const pp = new (require("workers-as-promised"))();
const e2p = require("../../e2p/e2p");
const { get } = require("chainfetch");
const WORKER_ID = Number(process.env.WORKER_ID);
let emojis = {};
pp.on("generateImage", async ({ input }, cb) => {
    let o;
    try {
        o = await e2p(input, emojis);
        if (!o) return cb();
    } catch(err) {
        //eslint-disable-next-line no-console
        console.error(err);
        return cb({ err });
    }
    
    const { generated, animated, image, isGif } = o;
    cb({ generated, animated, isGif, image });
});
(async () => {
    try {
        emojis = await get("https://cdn.jsdelivr.net/gh/omnidan/node-emoji@master/lib/emoji.json").toJSON();
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Cannot parse the emoji JSON. Please report this to our GitHub.");
        console.error(err);
        // Refuse to send ready
        return;
    }
    pp.send("ready", {
        id: WORKER_ID
    });
})();
