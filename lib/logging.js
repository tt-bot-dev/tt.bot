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
    async getInfo(guildID, db) {
        if (!guildID) return { logChannel: null, logEvents: [] };
        else {
            const config = await db.getGuildConfig(guildID);
            if (!config) return { logChannel: null, logEvents: [] };
            else {
                if (!config.logChannel || !config.logEvents) return {
                    logChannel: null,
                    logEvents: []
                };
                if (config.logEvents.split(";").includes("all")) return {
                    logChannel: config.logChannel,
                    logEvents: logging.availableTypes
                };
                return {
                    logChannel: config.logChannel,
                    logEvents: config.logEvents.split(";")
                        .filter(l => logging.availableTypes.includes(l))
                };
            }
        }
    }
};
module.exports = logging;