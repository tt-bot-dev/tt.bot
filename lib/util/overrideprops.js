"use strict";
function set() { }

const { Base, Guild } = require("eris");

/**
 * Overrides createdAt to provide more accurate timestamps
 */
Object.defineProperty(Base.prototype, "createdAt", {
    get: function () {
        return Number((BigInt(this.id) >> BigInt(22)) + BigInt(1420070400000));
    },
    set
});
/**
 * Uses the top visible channel as the default channel
 */
Object.defineProperty(Guild.prototype, "defaultChannel", {
    get: function () {
        if (this.channels.filter((c) => c.type === 0).length === 0) return null;
        const defaultChannel = this.channels.filter((c) => c.type === 0 && 
        this.shard.client.hasBotPermission(c, "readMessages"))
            .sort((a, b) => a.position - b.position)[0];
        if (!defaultChannel) return null;
        return this.channels.get(defaultChannel.id);
    },
    set
});