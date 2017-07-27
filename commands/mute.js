module.exports = {
    isCmd: true,
    exec: function (msg, args) {
        if (!args) return "Who should I mute?";
        userQuery(args, msg).then(u => {
            if (!bot.passesRoleHierarchy(msg.member, u)) return msg.channel.createMessage(`Sorry, you can't mute ${bot.getTag(u)}.`);
            else {
                let p = msg.channel.permissionsOf(u.id);
                msg.channel.editPermission(u.id, p.allow, (p.deny + 2048), "member").then(() => msg.channel.createMessage(`Successfully muted ${bot.getTag(u)} from this channel.`)).catch(() => msg.channel.createMessage(`I can't mute ${bot.getTag(u)}!`));
            }
        });
    },
    category: 3,
    description: "Mute an user.",
    display: true,
    args: "<user>"
};