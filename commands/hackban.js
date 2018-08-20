module.exports = {
    exec: async function (msg, args) {
        if (args) {
            async function dohackBan(id, doMessage, isMass) {
                let userToBan;
                let member;
                try {
                    userToBan = await bot.getUserWithoutRESTMode(args);
                } catch (err) {
                    if (doMessage) await msg.channel.createMessage(msg.t("ARGS_MISSING"));
                    return false;
                }
                if (msg.guild.members.get(userToBan.id)) member = msg.guild.members.get(userToBan.id);
                try {
                    if (member && !bot.passesRoleHierarchy(msg.member, member)) { msg.channel.createMessage(msg.t("ROLE_HIERARCHY_ERROR")); return false; }
                    await msg.guild.banMember(userToBan.id, 0, `${isMass == false ? "Hackbanned" : "Masshackbanned"} by ${bot.getTag(msg.author)}`);
                    if (doMessage) await msg.channel.createMessage(":ok_hand:");
                    return true;
                } catch (err) {
                    if (doMessage) await msg.channel.createMessage(msg.t("MISSING_PERMISSIONS"));
                    return false;
                }
            }
            if (args.split(" ").length > 1) {
                const bans = await Promise.all(args.split(" ").map(async u => await dohackBan(u, false, true)));
                msg.channel.createMessage(msg.t("HACKBANNED_USERS", bans.filter(b => !!b)));
            } else {
                await dohackBan(args, true, false);
            }
        } else {
            return await bot.createMessage(msg.channel.id, msg.t("ARGS_MISSING"));
        }
    },
    isCmd: true,
    name: "hackban",
    display: true,
    category: 3,
    description: "Bans a user by ID.",
    args: "<user id> [<user id> <user id>...]"
};