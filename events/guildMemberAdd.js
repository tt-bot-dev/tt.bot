"use strict";
const { Event } = require("sosamba");

class GuildMemberJoinEvent extends Event {
    constructor(...args) {
        super(...args, {
            name: "guildMemberAdd"
        });
    }

    async run(guild, member) {
        const config = await this.sosamba.db.getGuildConfig(guild.id);
        if (config && config.greetingChannelId && config.greetingMessage) {
            const channel = guild.channels.get(config.greetingChannelId);
            if (channel) {
                try { 
                    await channel.createMessage(
                        this.sosamba.parseMsg(config.greetingMessage, member, guild));
                } catch(_) {console.error(_);}
            } else {
                await this.sosamba.db.updateGuildConfig({
                    greetingChannelId: null
                });
            }
        }
    }
}

module.exports = GuildMemberJoinEvent;