"use strict";
const { Event, Logger } = require("sosamba");
const { WorkerTypes } = require("../util/worker");
const { version } = require("../package.json");
const { botsGGKey, topGGKey } = require("../config");

class ReadyEvent extends Event {
    constructor(...args) {
        super(...args, {
            name: "ready"
        });
        this.posterLog = new Logger({
            level: (this.sosamba.options.log && this.sosamba.options.log.level) ?
                this.sosamba.options.log.level : undefined,
            name: "DBLPoster"
        });
    }
    async run() {
        if (!this.sosamba.workers.workersRan) {
            for (let i = 0; i < config.workerCount; i++) {
                await Promise.all(Object.values(WorkerTypes).map(w => this.sosamba.workers.startWorker(w)));
                this.sosamba.workers.workersRan = true;
            }
        }
        this.sosamba.editStatus("dnd", { name: `Temporarily running v4 on development DBs, some features might not work as expected. | ${config.prefix}help`, type: 0 });
        await this.postStats();
        setInterval(() => this.postStats(), 1800000);
        await this.leaveBotCollectionServers();
        //const blacklist = await this.sosamba.db.getBlacklistedGuilds();
        const blacklist = [];
        await Promise.all(this.sosamba.guilds.map(g => {
            if (blacklist.find(entry =>
                entry.id === g.id || g.ownerID === entry.ownerID)) {
                return g.leave()
                    .then(() => this.log.debug(`Left ${g.name} (${g.id}) for being a blacklisted guild`));
            } else {
                return Promise.resolve();
            }
        }));
        this.log.info(`tt.bot ${version} is connected as ${this.sosamba.getTag(this.sosamba.user)}`);
    }

    async leaveBotCollectionServers() {
        await Promise.all(this.sosamba.botCollectionServers
            .map(g => g.leave()
                .then(
                    () => this.log.debug(`Left ${g.name} (${g.id}) for being a bot collection guild`))
            ));
    }
    async postStats() {
        if (botsGGKey) try {
            await this.sosamba.postStatsTo(botsGGKey, `https://discord.bots.gg/api/v1/bots/${this.user.id}/stats`, {
                guildCount: this.sosamba.guilds.size
            });
        } catch (err) {
            this.posterLog.error("Cannot POST to bots.gg :(", err.body);
        }
        if (topGGKey) try {
            await this.sosamba.postStatsTo(topGGKey, `https://discordbots.org/api/bots/${this.user.id}/stats`);
        } catch (err) {
            this.posterLog.error("Cannot post to top.gg :(", err.body);
        }
    }
}

module.exports = ReadyEvent;