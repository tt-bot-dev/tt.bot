module.exports = {
    exec: async function (msg, args) {
        const [caseID, ...reason] = args.split(" ");
        if (!caseID || reason.length == 0) return msg.channel.createMessage(msg.t("ARGS_MISSING"));
        try {
            await bot.modLog.updateReason(caseID, msg, reason.join(" "));
            msg.channel.createMessage(":ok_hand:");
        } catch(err) {
            msg.channel.createMessage(msg.t("ERROR", err));
        }
    },
    isCmd: true,
    display: true,
    category: 3,
    description: "Set a reason for an action",
    args: "<case id> <reason>"
};