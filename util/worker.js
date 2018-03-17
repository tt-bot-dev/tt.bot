const pp = require("process-as-promised");
const { fork } = require("child_process");
const WorkerTypes = {
    E2P: 0,
    E2P_QUANTIZE: 1
};
function getFileName(workerType) {
    switch (workerType) {
    case WorkerTypes.E2P:
        return "e2pworker.js";
    case WorkerTypes.E2P_QUANTIZE:
        return "quantizeWorker.js";
    }
}
class WorkerManager {
    constructor() {
        this.workers = new Map();
        this.nextWorkerId = 0;
        process.setMaxListeners(0);
    }

    async startWorker(workerType) {
        return new Promise(rs => {
            const f = getFileName(workerType);
            if (!f) throw new Error("Invalid worker");
            const p = fork(`${__dirname}/${f}`, [], {
                env: {
                    WORKER_ID: this.nextWorkerId
                }
            });
            const ipc = new pp(p);
            const workerId = this.nextWorkerId;
            ipc.once("ready", ({ id }) => {
                console.log(`Worker ${id} is running!`);
                rs(obj);
            });
            ipc.on("workingCount", ({ id, working }) => {
                const obj = this.workers.get(id);
                obj.working = working;
            });
            ipc.on("debug", (d,c) => {console.log(d); c();});
            if (workerType === WorkerTypes.E2P) ipc.on("e2pquantize", async ({ frames }, cb) => {
                cb(await Promise.all(frames.map(d => 
                    this.sendToRandom(WorkerTypes.E2P_QUANTIZE, "quantizeImage", d).promise
                )));
            });
            const obj = {
                process: p,
                ipc,
                id: workerId,
                workerType,
                working: 0
            };
            this.workers.set(workerId, obj);
            this.nextWorkerId++;
        });
    }

    sendToRandom(type, command, args) {
        const val = this.workers.values();
        let arr = [...val].filter(w => w.workerType === type && w.working === 0); // prioritize nonworking workers
        if (arr.length === 0) {
            // assign the work to a random worker and hope nothing goes boom
            arr = [...val].filter(w => w.workerType === type);
        }
        //console.log(arr.length)
        let worker = Math.floor(Math.random() * arr.length); // workers are zero indexed.
        if (worker === arr.length) worker = arr.length - 1;
        return {
            id: arr[worker].id,
            promise: this.send(arr[worker].id, command, args)
        };
    }

    send(id, command, args) {
        if (!this.workers.get(id)) {
            console.log(`No worker with ID ${id}`);
            return;
        }
        const { ipc } = this.workers.get(id);
        return ipc.send(command, args);
    }
}
WorkerManager.WorkerTypes = WorkerTypes;

module.exports = WorkerManager;