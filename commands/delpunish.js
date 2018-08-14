module.exports = {
    exec: async function (msg, args) {
        let splitargs = args.split(" | ");
        let options = {};
        splitargs.forEach(async fe => {
            if (fe.match(/(punishment-id:([^]{0,34}))/i)) {
                if (!options.punishmentID) {
                    options.punishmentID = fe.replace(/punishment-id:/, "").replace(/ \\\| /g, " | ");
                }
            } else if (fe.match(/(reason:([^]{0,400}))/i)) {
                if (!options.reason) {
                    options.reason = fe.replace(/reason:/, "").replace(/ \\\| /g, " | ");
                }
            } else {
                msg.channel.createMessage(msg.t("INVALID_ARG", `\`${fe}\``));
            }
        });
        
        if (!options.punishmentID) return msg.channel.createMessage(msg.t("ARGS_MISSING"));
        try {
            await bot.modLog.removeStrike(options.punishmentID, msg, options.reason);
        } catch(err) {
            msg.channel.createMessage(msg.t("CANNOT_UNSTRIKE", err));
        }
    },
    isCmd: true,
    display: true,
    category: 3,
    description: "Remove a punishment\nThe command uses `\u200b | \u200b` as separators (note the spaces). Use ` \\| ` to escape the separation in your queries.\nThe order of the switches doesn't need to be followed.",
    args: "<punishment-id:<case id>>[ | <reason:<reason>>]",
    aliases: ["rmpunish", "deletepunishment", "removepunishment", "rmstrike", "delstrike", "removestrike", "removepunishment"]
};