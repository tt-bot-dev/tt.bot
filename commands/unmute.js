module.exports = {
    isCmd: true,
    exec: function (msg, args) {
        if (!args) return "Who should I unmute?";
        userQuery(args, msg).then(u => {
            if (!bot.passesRoleHierarchy(msg.member, u)) return msg.channel.createMessage(`Sorry, you can't mute ${bot.getTag(u)}.`);
            else {
                let p = msg.channel.permissionsOf(u.id);
                (function () {
                    if (p.deny == 2048) {
                        return msg.channel.deletePermission(u.id);
                    } else {
                        return msg.channel.editPermission(u.id, (p.allow - 2048), p.deny, "member");
                    }
                })().then(() => msg.channel.createMessage(`Successfully unmuted ${bot.getTag(u)} from this channel.`)).catch(() => msg.channel.createMessage(`I can't unmute ${bot.getTag(u)}!`));
            }
        });
    },
    category: 3,
    description: "Unmute an user.",
    display: true,
    args: "<user>"
};