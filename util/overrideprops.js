const [major] = process.versions.node.split(".");
function set() {}

/**
 * Overrides createdAt to provide more accurate timestamps when used with node v10+
 * When < v10 is used, the property uses the fallback function which might not be accurate.
 * This doesn't use the <number>n thing in order to not mess with node <v10
 */
Object.defineProperty(ErisO.Base.prototype, "createdAt", {
    get: function() {
        if (major >= 10) {
            // eslint-disable-next-line no-undef
            return Number((BigInt(this.id) >> BigInt(22)) + BigInt(1420070400000));
        } else {
            /* no brackets here, according to maths, division takes precedence over addition;
            idk why they do that in eris*/

            return this.id / 4194304 + 1420070400000;
        }
    },
    set
});

/**
 * msg.guild polyfill
 */
Object.defineProperty(ErisO.Message.prototype, "guild", {
    get: function () { return this.channel.guild; }
});

/**
 * Uses the top visible channel as the default channel
 */
Object.defineProperty(ErisO.Guild.prototype, "defaultChannel", {
    get: function () {
        if (this.channels.filter((c) => c.type == 0).length == 0) return null;
        const defaultChannel = this.channels.filter((c) => c.type == 0 && c.permissionsOf(this.shard.client.user.id).has("readMessages")).sort((a, b) => a.position - b.position)[0];
        if (!defaultChannel) return null;
        return this.channels.get(defaultChannel.id);
    },
    set
});