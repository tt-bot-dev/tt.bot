let EventEmitter = require("events").EventEmitter
module.exports = class Emitter extends EventEmitter {
    constructor(channel1, channel2) {

        super();
        this._chan1 = channel1
        this._chan2 = channel2
        let chan1id = channel1.id;
        let chan2id = channel2.id
        channel1.createMessage(this.getMessage(channel2));
        channel2.createMessage(this.getMessage(channel1));
        const bindingFunction = function (msg) {
            if (msg.guild.id == channel1.guild.id || msg.guild.id == channel2.guild.id) {
                if (msg.channel.id == chan1id || msg.channel.id == chan2id) {
                    if (!msg.author) return;
                    if (msg.author.bot) return;
                    else {
                        if (!msg.content.startsWith("^")) return console.log(`Ain't treating ${msg.content} as a speakerphone message`)
                        let mToSend = msg.content.slice(1);
                        if (mToSend) {
                            if (msg.channel.id == channel1.id) bot.createMessage(channel2.id, `${msg.author.username}#${msg.author.discriminator}: ${mToSend}`);
                            else if (msg.channel.id == channel2.id) bot.createMessage(channel1.id, `${msg.author.username}#${msg.author.discriminator}: ${mToSend}`);
                        }
                    }
                }
            }
        }

        bot.on("messageCreate", bindingFunction)
        this.once("EndSpeakerphone", (endChannel) => {
            bot.removeListener("messageCreate", bindingFunction);
            if (endChannel == channel1) { channel2.createMessage("The other side has ended the communication."); endChannel.createMessage("You ended the communication.") }
            else if (endChannel == channel2) { channel1.createMessage("The other side has ended the communication."); endChannel.createMessage("You ended the communication.") }
        })
    }
    getMessage(channel) {
        return `Connected to #${channel.name} at ${channel.guild.name}\n\nPrefix your messages with \`^\` to send them over.`
    }
}