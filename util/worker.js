const pp = require("process-as-promised");
const { fork } = require("child_process");
const WorkerTypes = {
    E2P: 0
};
function getFileName(workerType) {
    switch(workerType) {
    case WorkerTypes.E2P:
        return "e2pworker.js";
    }
}
class WorkerManager {
    constructor() {
        this.workers = new Map();
        this.nextWorkerId = 0;
    }

    async startWorker(workerType) {
        const f = getFileName(workerType);
        if (!f) throw new Error("Invalid worker");
        const p = fork(`${__dirname}/${f}`, [], {
            env: {
                WORKER_ID: this.nextWorkerId
            }
        });
        const ipc = new pp(p);
        ipc.once("ready", ({id}) => {
            console.log(`Worker ${id} is running!`);
        });
        ipc.on("isWorking", ({id, working}) => {
            const obj = this.workers.get(id);
            obj.working = working;
        });
        const obj = {
            process: p,
            ipc,
            id: this.nextWorkerId,
            workerType
        };
        this.workers.set(this.nextWorkerId, obj);
        this.nextWorkerId++;
        return obj;
    }

    sendToRandom(type, command, args) {
        const val = this.workers.values();
        let arr = [...val].filter(w => w.workerType === type && !w.working);
        if (arr.length === 0) {
            // assign the work to a random worker and hope nothing goes boom
            arr = [...val].filter(w => w.workerType === type);
        }
        const worker = Math.floor(Math.random() * arr.length); // workers are zero indexed.
        return this.send(worker, command, args);
    }

    send(id, command, args) {
        if (!this.workers.get(id)) return;
        const { ipc, working } = this.workers.get(id);
        if (working) return; // let's not give more work to already working workers
        return ipc.send(command, args);
    }
}
WorkerManager.WorkerTypes = WorkerTypes;

module.exports = WorkerManager;