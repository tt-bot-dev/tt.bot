module.exports = {
    exec: async function (msg, args) {
        let inviteData;
        try {
            inviteData = await bot.getInvite(args, true);
        } catch (err) {
            return msg.channel.createMessage({
                embed: {
                    color: 0x880000,
                    author: {
                        name: "Um.. I have a little problem."
                    },
                    description: "I cannot get the information on the invite.",
                    footer: {
                        text: "Are you sure the invite exists and that I'm not banned from there? This also doesn't work with group DMs."   
                    }
                }
            });
        }
        if (inviteData.channel.type === 3) {
            msg.channel.createMessage({
                embed: {
                    color: 0x008800,
                    author: {
                        name: inviteData.channel.name || inviteData.channel.recipients.map(u => u.username).join(", "),
                        icon_url: inviteData.channel.icon ? `https://cdn.discordapp.com/channel-icons/${inviteData.channel.id}/${inviteData.channel.icon}.png` : null
                    },
                    fields: [{
                        name: "Channel type",
                        value: `Group DM with ${inviteData.memberCount} members`,
                        inline: true
                    }, {
                        name: "Join",
                        value: `Click [this](https://discord.gg/${inviteData.code})`,
                        inline: true
                    }],
                    footer: {
                        text: `Invited by ${bot.getTag(inviteData.inviter)}`,
                        icon_url: inviteData.avatarURL
                    }
                }
            });
        } else {
            msg.channel.createMessage({
                embed: {
                    color: 0x008800,
                    author: {
                        name: inviteData.guild.name,
                        icon_url: inviteData.guild.icon ? `https://cdn.discordapp.com/icons/${inviteData.guild.id}/${inviteData.guild.icon}.png` : null
                    },
                    fields: [{
                        name: "Channel type",
                        value: `${inviteData.channel.type === 0 ? "Text" : "Voice"} channel named ${bot.escapeMarkdown(inviteData.channel.name)}`,
                        inline: true
                    }, {
                        name: "Guild ID",
                        value: inviteData.guild.id,
                        inline: true
                    }, {
                        name: "Members",
                        value: `${inviteData.memberCount} members, ${inviteData.presenceCount} online.`,
                        inline: true
                    }, {
                        name: "Join",
                        value: `Click [this](https://discord.gg/${inviteData.code})`,
                        inline: true
                    }],
                    footer: inviteData.inviter ? {
                        text: `Invited by ${bot.getTag(inviteData.inviter)}`,
                        icon_url: inviteData.avatarURL
                    } : null
                }
            });
        }
        /*
        let fields = [{
            name: `Invite is for ${inviteData.channel.type == 0 ? "text" : "voice"} channel #${inviteData.channel.name}`,
            value: `The channel ID is ${inviteData.channel.id} and the channel mention is <#${inviteData.channel.id}>`,
            inline: true
        }, {
            name: `The guild ID is ${inviteData.guild.id}`,
            value: `You can also click [here](https://discord.gg/${inviteData.code}) to join the server.\nNote: The invite link placement is **NOT** for advertisement purposes. We are not responsible for any advertisement problems caused by abuse of this command.`,
            inline: true
        }];
        if (inviteData.memberCount && inviteData.presenceCount) {
            fields.push({
                name: "More information",
                value: `There is approximately ${inviteData.memberCount} members, from which ${inviteData.presenceCount} are online.`
            });
        }
        msg.channel.createMessage({
            embed: {
                author: {
                    name: `Inspected invite data from the guild ${inviteData.guild.name}`,
                    icon_url: inviteData.guild.icon ? `https://cdn.discordapp.com/icons/${inviteData.guild.id}/${inviteData.guild.icon}.webp` : ""
                },
                description: "These information might change at any time.",
                fields,
                footer: inviteData.inviter ? {
                    text: `Invite made by ${inviteData.inviter.username}#${inviteData.inviter.discriminator}`,
                    icon_url: inviteData.inviter.staticAvatarURL
                } : undefined,
                color: 0x008800
            }
        });*/
    },
    isCmd: true,
    display: true,
    category: 1,
    description: "~~Spy~~ Get information on the invites",
    args: "<invite code>",
    aliases: [
        "iinspector"
    ]
};