const { Event } = require("sosamba");
const {WorkerTypes} = require("../util/worker");

class ReadyEvent extends Event {
    constructor(...args) {
        super(...args, {
            name: "ready"
        })
    }
    async run() {
        this.log.log("I'm ready....")
        if (!this.sosamba.workers.workersRan) {
            for (let i = 0; i< config.workerCount; i++) {
                await Promise.all(Object.values(WorkerTypes).map(w => this.sosamba.workers.startWorker(w)));
                this.sosamba.workers.workersRan = true;
            }
        }
        this.sosamba.editStatus("online", { name: `Type ${config.prefix}help`, type: 0 });
    }
}

module.exports = ReadyEvent;