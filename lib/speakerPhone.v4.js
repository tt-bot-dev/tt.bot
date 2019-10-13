"use strict";
const { MessageListener } = require("sosamba");
const config = require("../config");
const PHONE = "\u260e";

class PhoneMessageListener extends MessageListener {
    constructor(sosamba) {
        super(sosamba);
        this.channels = new Map();
    }


    async die(meta) {
        meta.caller.createMessage("You have hung up.");
        meta.otherSide.createMessage("The other side has hung up.");
        this.channels.delete(meta.otherSide.id);
        this.channels.delete(meta.caller.id);
    }

    async run(ctx) {
        const channel = this.channels.get(ctx.channel.id);

        if (ctx.msg.content.startsWith(`${config.prefix}hangup`)) {
            this.die(channel);
            return;
        } else {
            const content = ctx.msg.content.slice(1);
            if (content || ctx.msg.attachments.length !== 0) {
                channel.otherSide.createMessage(`${PHONE} ${this.sosamba.getTag(ctx.author)}: ${content || ""}\n${
                    ctx.msg.attachments.length !== 0 ? ctx.msg.attachments.map(a => a.url).join("\n") : ""
                }`);
            }
        }
    }


    addChannels(caller, otherSide, callData, otherSideCallData) {
        this.channels.set(caller.id, {
            otherSide,
            caller,
            callData,
            otherSideCallData
        });
        this.channels.set(otherSide.id, {
            otherSide: caller,
            caller: otherSide,
            callData: otherSideCallData,
            otherSideCallData: callData
        });

        caller.createMessage(`${PHONE} Connected to ${otherSideCallData.id} ${
            !otherSideCallData.private ?
                `(#${otherSide.name} at ${otherSide.guild.name})`
                : ""}\n\nPrefix your messages with \`^\` to send them over.\nType \`${config.prefix}hangup\` to hang up`);

        otherSide.createMessage(`${PHONE} Connected to ${callData.id} ${
            !callData.private ?
                `(#${caller.name} at ${caller.guild.name})`
                : ""}\n\nPrefix your messages with \`^\` to send them over.\nType \`${config.prefix}hangup\` to hang up`);
    }

    async prerequisites(ctx) {
        return this.channels.has(ctx.channel.id)
            && (ctx.msg.content.startsWith("^")
                || ctx.msg.content.startsWith(`${config.prefix}hangup`));
    }
}

module.exports = PhoneMessageListener;