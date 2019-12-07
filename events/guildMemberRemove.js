"use strict";
const { Event } = require("sosamba");

class GuildMemberLeaveEvent extends Event {
    constructor(...args) {
        super(...args, {
            name: "guildMemberRemove"
        });
    }

    async run(guild, member) {
        const config = await this.sosamba.db.getGuildConfig(guild.id);
        if (config && config.farewellChannelId && config.farewellMessage) {
            const channel = guild.channels.get(config.farewellChannelId);
            if (channel) {
                try { 
                    await channel.createMessage(
                        this.sosamba.parseMsg(config.farewellMessage, member, guild));
                } catch(_) {console.error(_)}
            } else {
                await this.sosamba.db.updateGuildConfig({
                    farewellChannelId: null
                });
            }
        }
    }
}

module.exports = GuildMemberLeaveEvent;