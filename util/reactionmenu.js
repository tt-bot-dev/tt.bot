"use strict";
class ReactionMenu {
    constructor(messageID, channelID, authorID, options) {
        this.messageID = messageID;
        this.channelID = channelID;
        this.authorID = authorID;
        this.options = options;
    }

    bind() {
        bot.on("messageReactionAdd", this.handleReactionAdd.bind(this));
        bot.on("messageDelete", this.handleDeleteMessage.bind(this));
        bot.on("messageDeleteBulk", this.handleDeleteMessage.bind(this));
        bot.on("channelDelete", this.handleChannelDelete.bind(this));
    }

    unbind() {
        bot.removeListener("messageReactionAdd", this.handleReactionAdd.bind(this));
        bot.removeListener("messageDelete", this.handleDeleteMessage.bind(this));
        bot.removeListener("messageDeleteBulk", this.handleDeleteMessage.bind(this));
        bot.removeListener("channelDelete", this.handleChannelDelete.bind(this));
    }

    start(/*timeout = 0*/) {
        this.bind();
    }

    handleChannelDelete(c) {
        if (this.stopped) return;
        if (c.id !== this.channelID) return;
        this.unbind();
        this.options.stopCallback(ReactionMenu.CHANNEL_DELETE);
    }

    handleDeleteMessage(msg) {
        if (this.stopped) return;
        if (Array.isArray(msg)) {
            if (msg.find(m => m.id === this.messageID)) {
                this.unbind();
                return this.options.stopCallback(ReactionMenu.MESSAGE_DELETE);
            }
        } else {
            if (msg.id !== this.messageID) return;
            this.unbind();
            return this.options.stopCallback(ReactionMenu.MESSAGE_DELETE);
        }
    }

    handleReactionAdd(msg, emoji, ID) {
        if (this.stopped) return false;
        if (msg.id !== this.messageID) return false;
        if (ID !== this.authorID) return false;
        if (emoji.name === ReactionMenu.STOP) {
            if (this.options.stopCallback && !this.stopped) {
                this.stopped = true;
                this.unbind();
                return this.options.stopCallback(ReactionMenu.MANUAL_EXIT);
            }
            else throw new Error("The stop callback is missing.");
        }
        return true;
    }
}
ReactionMenu.STOP = "⏹";
ReactionMenu.MANUAL_EXIT = 0;
ReactionMenu.MESSAGE_DELETE = 1;
ReactionMenu.CHANNEL_DELETE = 2;
ReactionMenu.TIMEOUT = 3;
module.exports = ReactionMenu;