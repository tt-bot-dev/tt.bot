const pp = new (require("process-as-promised"))();
const e2p = require("../emojitopic");
const WORKER_ID = Number(process.env.WORKER_ID);
pp.on("generateImage", async ({input}, cb) => {
    pp.send("isWorking", {id: WORKER_ID, working: true});
    const {generated, animated, image} = await e2p(input);
    pp.send("isWorking", {id: WORKER_ID, working: true});
    cb({generated, animated, image: image.toString("base64")});
});
(async () => {
    pp.send("ready", {
        id: WORKER_ID
    });
})();