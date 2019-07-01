"use strict";
const pp = new (require("process-as-promised"))();
const e2p = require("../../lib/e2p");
const WORKER_ID = Number(process.env.WORKER_ID);
let emojis = {};
const httpGet = (url) =>
    new Promise((rs, rj) => {
        const { get } = require("https");
        const { get: httpGet } = require("http");
        const getHandler = url.startsWith("http://") ? httpGet : get;
        getHandler(url, r => {
            let buffers = [];
            r.on("data", c => buffers.push(c));
            r.once("end", () => {
                const b = Buffer.concat(buffers);
                buffers = null;
                rs(b);
            });
            r.on("error", rj);
        });
    });
pp.on("generateImage", async ({input}, cb) => {
    let o;
    try {
        o = await e2p(input, emojis);
        if (!o) return cb();
    } catch(err) {
        //eslint-disable-next-line no-console
        console.error(err);
        return cb({ err });
    }
    
    const {generated, animated, image, isGif} = o;
    cb({generated, animated, isGif, image: image.toString("base64")});
});
(async () => {
    const d = await httpGet("https://cdn.jsdelivr.net/gh/omnidan/node-emoji@master/lib/emoji.json");
    try {
        emojis = JSON.parse(d.toString());
    } catch {
        // eslint-disable-next-line no-console
        console.error("Cannot parse the JSON. Please report this to our GitHub.");
        // Refuse to send ready
        return;
    }
    pp.send("ready", {
        id: WORKER_ID
    });
})();
