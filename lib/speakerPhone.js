let EventEmitter = require("events").EventEmitter;
module.exports = class Emitter extends EventEmitter {
    constructor(channel1, channel2, callData1, callData2) {
        super();
        this._phoneEmoji = "\u260e";
        this._chan1 = channel1;
        this._chan2 = channel2;
        let chan1id = channel1.id;
        let chan2id = channel2.id;
        const getSpeakerPhoneMessage = (author, text) => ({
            content: `${this._phoneEmoji} ${bot.getTag(author)}: ${text}`,
            disableEveryone: true
        });
        channel1.createMessage(this.getMessage(channel2, callData2));
        channel2.createMessage(this.getMessage(channel1, callData1));
        const bindingFunction = msg => {
            if (msg.guild.id == channel1.guild.id || msg.guild.id == channel2.guild.id) {
                if (msg.channel.id == chan1id || msg.channel.id == chan2id) {
                    if (!msg.author) return;
                    if (msg.author.bot) return;
                    else {
                        function listAttachments() {
                            if (msg.attachments.length > 0) {
                                return `\n${msg.attachments.map(a => a.url).join("\n")}`;
                            } else return "";
                        }
                        if (msg.content.startsWith(`${config.prefix}hangup`)) {
                            this.emit("EndSpeakerphone", msg.channel);
                            return;
                        }
                        if (!msg.content.startsWith("^")) return;
                        let mToSend = msg.content.slice(1);
                        if (mToSend || listAttachments()) {
                            if (msg.channel.id == channel1.id) bot.createMessage(channel2.id, getSpeakerPhoneMessage(msg.author, `${mToSend}${listAttachments()}`));
                            else if (msg.channel.id == channel2.id) bot.createMessage(channel1.id, getSpeakerPhoneMessage(msg.author, `${mToSend}${listAttachments()}`));
                        }
                    }
                }
            }
        };

        bot.on("messageCreate", bindingFunction);
        this.once("EndSpeakerphone", (endChannel) => {
            bot.removeListener("messageCreate", bindingFunction);
            if (endChannel.id == chan1id) {
                channel2.createMessage("The other side has hung up."); 
                endChannel.createMessage("You have hung up."); 
            }
            else if (endChannel.id == chan2id) { 
                channel1.createMessage("The other side has hung up."); 
                endChannel.createMessage("You have hung up."); 
            }
        });
    }
    getMessage(channel, side) {
        return `${this._phoneEmoji} Connected to ${side.id} ${!(side.private) ? `(#${channel.name} at ${channel.guild.name})` : ""}\n\nPrefix your messages with \`^\` to send them over.\nType \`${config.prefix}hangup\` to hang up`;
    }

};