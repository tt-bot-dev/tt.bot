let EventEmitter = require("events").EventEmitter;
module.exports = class Emitter extends EventEmitter {
    constructor(channel1, channel2) {
        super();
        this._phoneEmoji = "\u260e";
        this._chan1 = channel1;
        this._chan2 = channel2;
        let chan1id = channel1.id;
        let chan2id = channel2.id;
        let _phoneEmoji = "\u260e";
        function getSpeakerPhoneMessage(author, text) {
            return `${_phoneEmoji} ${author.username}#${author.discriminator}: ${text}`;
        }
        channel1.createMessage(this.getMessage(channel2));
        channel2.createMessage(this.getMessage(channel1));
        const bindingFunction = function (msg) {
            if (msg.guild.id == channel1.guild.id || msg.guild.id == channel2.guild.id) {
                if (msg.channel.id == chan1id || msg.channel.id == chan2id) {
                    if (!msg.author) return;
                    if (msg.author.bot) return;
                    else {
                        function listAttacments() {
                            if (msg.attachments.length > 0) {
                                let urlA = [];
                                msg.attachments.forEach(item => {
                                    urlA.push(item.url);
                                });
                                return `\n${urlA.join("\n")}`;
                            } else return "";
                        }
                        if (!msg.content.startsWith("^")) return;
                        let mToSend = msg.content.slice(1);
                        if (mToSend || listAttacments()) {
                            if (msg.channel.id == channel1.id) bot.createMessage(channel2.id, getSpeakerPhoneMessage(msg.author, `${mToSend}${listAttacments()}`));
                            else if (msg.channel.id == channel2.id) bot.createMessage(channel1.id, getSpeakerPhoneMessage(msg.author, `${mToSend}${listAttacments()}`));
                        }
                    }
                }
            }
        };

        bot.on("messageCreate", bindingFunction);
        this.once("EndSpeakerphone", (endChannel) => {
            bot.removeListener("messageCreate", bindingFunction);
            if (endChannel == channel1) { channel2.createMessage(_phoneEmoji + " The other side has ended the communication."); endChannel.createMessage(_phoneEmoji + " You ended the communication."); }
            else if (endChannel == channel2) { channel1.createMessage(_phoneEmoji + " The other side has ended the communication."); endChannel.createMessage(_phoneEmoji + " You ended the communication."); }
        });
    }
    getMessage(channel) {
        return `${this._phoneEmoji} Connected to #${channel.name} at ${channel.guild.name}\n\nPrefix your messages with \`^\` to send them over.`;
    }

};