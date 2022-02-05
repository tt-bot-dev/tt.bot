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


import pp from "workers-as-promised";
import { Worker } from "worker_threads";
const WorkerTypes = {
    E2P: 0,
};
function getFileName(workerType) {
    switch (workerType) {
    case WorkerTypes.E2P:
        return "e2pworker.mjs";
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
            const p = new Worker(`${__dirname}/workers/${f}`, {
                env: {
                    WORKER_ID: this.nextWorkerId.toString()
                },
            });
            
            const ipc = new pp(p);
            const workerId = this.nextWorkerId;
            ipc.once("ready", ({ id }) => {
                //eslint-disable-next-line no-console
                console.info(`Worker #${id} ready`);
                rs(obj);
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

export default WorkerManager;

export { WorkerTypes };