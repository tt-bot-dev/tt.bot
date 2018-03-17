const pp = new (require("process-as-promised"))();
const WORKER_ID = Number(process.env.WORKER_ID);
const GifWrap = require("gifwrap");
let workingCount = 0;
process.setMaxListeners(0);
pp.on("quantizeImage", async ({data, width, height}, cb) => {
    workingCount++
    pp.send("workingCount", {id: WORKER_ID, working: workingCount});
    const f = new GifWrap.GifFrame({width, height, data: Buffer.from(data, "base64")})
    GifWrap.GifUtil.quantizeDekker([f]);
    workingCount--
    pp.send("workingCount", {id: WORKER_ID, working: workingCount});
    cb({width: f.bitmap.width, height: f.bitmap.height, data: f.bitmap.data.toString("base64")});
});
(async () => {
    pp.send("ready", {
        id: WORKER_ID
    });
})();