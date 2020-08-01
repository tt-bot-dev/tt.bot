const Command = require("../lib/commandTypes/AdminCommand");
const { announcementChannelID } = require("../config");

class UpdateFollowCommand extends Command {
    constructor(...args) {
        super(...args, {
            description: "Receive updates about tt.bot in this channel.",
            aliases: ["updates"],
            name: "botupdates"
        });
    }

    async run(ctx) {
        if (!ctx.sosamba.hasBotPermission(ctx.channel, "manageWebhooks")) {
            await ctx.send({
                embed: {
                    title: ":x: Missing Permissions",
                    description: "I need to be able to manage webhooks in this channel in order to set up bot updates. After that, you can feel free to remove it from me.",
                    color: 0xff0000,
                }
            });
            return;
        }

        await ctx.sosamba.followChannel(announcementChannelID, ctx.channel.id);
        await ctx.send(`:ok_hand: All the latest and greatest updates about ${ctx.sosamba.user.username} will be sent here.`);
    }
}

module.exports = UpdateFollowCommand;
