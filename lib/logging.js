"use strict";
const logging = {
    availableTypes: ["messageUpdate", "messageDelete", "messageBulkDelete", "messageUnknownDelete", "guildBan", "guildUnban"],
    handlers: {
        update: require("./logging/handlers/update"),
        unknownDelete: require("./logging/handlers/unknownDelete"),
        delete: require("./logging/handlers/delete"),
        bulkDelete: require("./logging/handlers/bulkDelete"),
        ban: require("./logging/handlers/ban")
    },
    async getInfo(guildId) {
        if (!guildId) return {logChannel: null, logEvents: []};
        else {
            const cfg = await db.table("configs").get(guildId);
            if (!cfg) return {logChannel: null, logEvents: []};
            else {
                if (!cfg.logChannel || !cfg.logEvents) return {
                    logChannel: null,
                    logEvents: []
                };
                if (cfg.logEvents.split(";").includes("all")) return {
                    logChannel: cfg.logChannel, logEvents: logging.availableTypes
                };
                return {logChannel: cfg.logChannel, logEvents: cfg.logEvents.split(";").filter(l => logging.availableTypes.includes(l))};
            }
        }
    }
};
module.exports = logging;