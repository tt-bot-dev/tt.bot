const { Event } = require("sosamba");
const { serverLogChannel } = require("../config");

class GuildLeaveEvent extends Event {
    constructor(...args) {
        super(...args, {
            name: "guildDelete"
        });
    }

    async run(guild) {
        await this.sosamba.createMessage(serverLogChannel, {
            embed: {
                author: {
                    name: `I was removed from ${guild.name} (${guild.id}) 😢`,
                    icon_url: guild.iconURL
                },
                color: 0x008800
            }
        })
    }
}

module.exports = GuildLeaveEvent;