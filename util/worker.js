"use strict";
const pp = require("process-as-promised");
const { fork } = require("child_process");
const WorkerTypes = {
    E2P: 0,
};
function getFileName(workerType) {
    switch (workerType) {
    case WorkerTypes.E2P:
        return "e2pworker.js";
    }
}
class WorkerManager {
    constructor() {
        this.workers = new Map();
        this.nextWorkerId = 0;
        this.workersRan = false;
        process.setMaxListeners(0);
    }

    async startWorker(workerType) {
        return new Promise(rs => {
            const f = getFileName(workerType);
            if (!f) throw new Error("Invalid worker");
            const p = fork(`${__dirname}/workers/${f}`, [], {
                env: {
                    WORKER_ID: this.nextWorkerId
                },
                windowsHide: true
            });
            const ipc = new pp(p);
            const workerId = this.nextWorkerId;
            ipc.once("ready", ({ id }) => {
                //eslint-disable-next-line no-console
                console.log(`Worker ${id} is running!`);
                rs(obj);
            });
            //eslint-disable-next-line no-console
            ipc.on("debug", (d, c) => { console.log(d); c(); });
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
        const val = Array.from(this.workers.values());
        let arr = val.filter(w => w.workerType === type && w.working === 0); // prioritize nonworking workers
        if (arr.length === 0) {
            // assign the work to a random worker and hope nothing goes boom
            arr = val.filter(w => w.workerType === type);
        }
        let worker = Math.floor(Math.random() * arr.length); // workers are zero indexed.
        if (worker === arr.length) worker = arr.length - 1;
        return {
            id: arr[worker].id,
            promise: this.send(arr[worker].id, command, args).then(o => {
                arr[worker].working--;
                return o;
            })
        };
    }

    send(id, command, args) {
        if (!this.workers.get(id)) {
            return;
        }
        const worker = this.workers.get(id);
        worker.working++;
        return worker.ipc.send(command, args);
    }
}
WorkerManager.WorkerTypes = WorkerTypes;

module.exports = WorkerManager;