module.exports = {
    exec: async function (msg, args) {
        const [caseID, ...reason] = args.split(" ");
        if (!caseID) return msg.channel.createMessage(msg.t("ARGS_MISSING"));
        try {
            await bot.modLog.removeStrike(caseID, msg, reason.join(" "));
        } catch(err) {
            msg.channel.createMessage(msg.t("CANNOT_UNSTRIKE", err));
        }
    },
    isCmd: true,
    display: true,
    category: 3,
    description: "Remove a strike from an user.",
    args: "<case id> [reason]",
    aliases: ["rmpunish", "deletepunishment", "removepunishment", "rmstrike", "delstrike", "removestrike", "removepunishment"]
};