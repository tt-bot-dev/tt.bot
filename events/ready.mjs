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

"use strict";

import { Event, Logger } from "sosamba";
import w from "../lib/util/worker.mjs";
import config from "../config.js";
import ttbotPackage from "../lib/package.mjs";

const { botsGGKey, topGGKey, workerCount, prefix } = config;
const { WorkerTypes } = w;

class ReadyEvent extends Event {
    posterLog = new Logger({
        level: this.sosamba.options.log?.level || undefined,
        name: "DBLPoster"
    });
    firedUp = false;

    constructor(...args) {
        super(...args, {
            name: "ready"
        });
    }
    async run() {
        if (!this.firedUp) {
            for (let i = 0; i < workerCount; i++) {
                await Promise.all(Object.values(WorkerTypes).map(w => this.sosamba.workers.startWorker(w)));
                this.sosamba.workers.workersRan = true;
            }
            await this.postStats();
            setInterval(() => this.postStats(), 1800000);
            this.firedUp = true;
        }
        this.sosamba.editStatus("online", { name: `Type ${prefix}help | v${ttbotPackage.version}`, type: 0 });
        await this.leaveBotCollectionServers();
        const blacklist = await this.sosamba.db.getBlacklistedGuilds();
        await Promise.all(this.sosamba.guilds.map(g => {
            if (blacklist.find(entry =>
                entry.id === g.id || g.ownerID === entry.ownerID)) {
                return g.leave()
                    .then(() => this.log.debug(`Left ${g.name} (${g.id}) for being a blacklisted guild`));
            } else {
                return Promise.resolve();
            }
        }));
        this.log.info(`tt.bot ${ttbotPackage.version} is connected as ${this.sosamba.getTag(this.sosamba.user)}`);
        this.sosamba.readyTime = Date.now();
    }

    async leaveBotCollectionServers() {
        // This is not effective with intents
        /*await Promise.all(this.sosamba.botCollectionServers
            .map(g => g.leave()
                .then(
                    () => this.log.debug(`Left ${g.name} (${g.id}) for being a bot collection guild`))
            ));*/
    }
    async postStats() {
        if (botsGGKey) try {
            await this.sosamba.postStatsTo(botsGGKey, `https://discord.bots.gg/api/v1/bots/${this.sosamba.user.id}/stats`, {
                guildCount: this.sosamba.guilds.size
            });
        } catch (err) {
            this.posterLog.error("Cannot POST to bots.gg :(", err.body);
        }
        if (topGGKey) try {
            await this.sosamba.postStatsTo(topGGKey, `https://discordbots.org/api/bots/${this.sosamba.user.id}/stats`);
        } catch (err) {
            this.posterLog.error("Cannot post to top.gg :(", err.body);
        }
    }
}

export default ReadyEvent;