Object.defineProperty(ErisO.Message.prototype, "guild", {
    get: function () { return this.channel.guild; }
});
Object.defineProperty(ErisO.Guild.prototype, "defaultChannel", {
    get: function () {
        if (this.channels.filter((c) => c.type == 0).length == 0) return null;
        const defaultChannel = this.channels.filter((c) => c.type == 0 && c.permissionsOf(this.shard.client.user.id).has("readMessages")).sort((a, b) => a.position - b.position)[0];
        if (!defaultChannel) return null;
        return this.channels.get(defaultChannel.id);
    },
    set: function() {}
})