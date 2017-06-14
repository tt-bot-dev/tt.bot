module.exports = {
    exec: async function (msg, args) {
        let inviteData;
        let ownerMember = bot.users.get(config.oid);
        try {
            inviteData = await bot.getInvite(args)
        } catch (err) {
            return msg.channel.createMessage("I cannot get the invite data? Maybe I've been banné from there or it's revoked?")
        }
        let fields = [{
            name: `Invite is for ${inviteData.channel.type == 0 ? "text" : "voice"} channel #${inviteData.channel.name}`,
            value: `The channel ID is ${inviteData.channel.id} and the channel mention is <#${inviteData.channel.id}>`,
            inline: true
        }, {
            name: `The guild ID is ${inviteData.guild.id}`,
            value: `You can also click [here](https://discord.gg/${inviteData.code}) to join the server.\nNote: The invite link placement is **NOT** for advertisement purposes. I, ${ownerMember ? ownerMember.username : (await bot.getUserWithoutRESTMode(config.oid)).username}, am not responsible for any advertisement problems caused by abuse of this command. I can log you at any time.`,
            inline: true
        }]
        msg.channel.createMessage({
            embed: {
                author: {
                    name: `Inspected invite data from the guild ${inviteData.guild.name}`,
                    icon_url: inviteData.guild.icon ? `https://cdn.discordapp.com/icons/${inviteData.guild.id}/${inviteData.guild.icon}.webp` : ""
                },
                description: `These information might change at any time.`,
                fields: fields,
                footer: inviteData.inviter ? {
                    text: `Invite made by ${inviteData.inviter.username}#${inviteData.inviter.discriminator}`,
                    icon_url: inviteData.inviter.staticAvatarURL
                } : undefined,
                color: 0x008800
            }
        })
    },
    isCmd: true,
    display: true,
    category: 1,
    description: "Spy on the invites",
    args: "<invite code>",
    aliases: [
        "iinspector"
    ]
}