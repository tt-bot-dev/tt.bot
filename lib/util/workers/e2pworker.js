"use strict";
const pp = new (require("workers-as-promised"))();
const e2p = require("../../e2p/e2p");
const { get } = require("chainfetch");
const WORKER_ID = Number(process.env.WORKER_ID);
let emojis = {};
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
    cb({generated, animated, isGif, image });
});
(async () => {
    try {
        emojis = await get("https://cdn.jsdelivr.net/gh/omnidan/node-emoji@master/lib/emoji.json").toJSON();
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
