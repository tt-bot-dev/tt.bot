/**
 * Copyright (C) 2022 tt.bot dev team
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

import { isMainThread } from "worker_threads";
import WorkersAsPromised from "workers-as-promised";
import e2p from "../../e2p/e2p.mjs";

if (isMainThread) {
    const [input, outputFile] = process.argv.slice(2);
    const { writeFile } = await import("fs/promises");
    const { createInterface } = await import("readline");

    const ht = process.hrtime();
    const out = await e2p(input.split(" "), false);
    const ht2 = process.hrtime(ht);

    await writeFile(outputFile, Buffer.from(out.image));

    
    console.log(ht2);
    
    /*
    console.log(out);
    console.log(process.memoryUsage());

    setInterval(() => console.log(process.memoryUsage()), 10000);
    

    createInterface(process.stdin).once("line", () => process.exit(0));*/
} else {
    const pp = new WorkersAsPromised();
    const WORKER_ID = Number(process.env.WORKER_ID);
    pp.on("generateImage", async ({ input, asGif }, cb) => {
        let o;
        try {
            o = await e2p(input, asGif);
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
        pp.send("ready", {
            id: WORKER_ID
        });
    })();
}