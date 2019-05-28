"use strict";
const pp = new (require("process-as-promised"))();
const e2p = require("../../lib/e2p");
const WORKER_ID = Number(process.env.WORKER_ID);
let workingCount = 0;
pp.on("generateImage", async ({input}, cb) => {
    workingCount++;
    pp.send("workingCount", {id: WORKER_ID, working: workingCount});
    let o;
    try {
        o = await e2p(input, pp);
        if (!o) return cb();
    } catch(err) {
        //eslint-disable-next-line no-console
        console.error(err);
        return cb({ err });
    }
    
    const {generated, animated, image} = o;
    workingCount--;
    pp.send("workingCount", {id: WORKER_ID, working: workingCount});
    cb({generated, animated, image: image.toString("base64")});
});
(async () => {
    pp.send("ready", {
        id: WORKER_ID
    });
})();
