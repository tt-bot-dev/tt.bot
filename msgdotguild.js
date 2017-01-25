Object.defineProperty(ErisO.Message.prototype, "guild", {
    get: function() { return this.channel.guild; }
});