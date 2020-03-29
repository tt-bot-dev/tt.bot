"use strict";
/**
 * Constants to help people building an extension
 */
const r = {
    ChannelTypes: {
        text: 0,
        dm: 1,
        voice: 2,
        category: 4,
        news: 5,
        store: 6
    },
    AuditLogActions: {},
    ExtensionFlags: {
        httpRequests: 1,
        guildSettings: 1 << 1,
        dangerousGuildSettings: 1 << 2,
        guildModerative: 1 << 3,
        guildMembersMeta: 1 << 4,
        mentionEveryone: 1 << 5
    }
};

/**
 * Copy over Eris' audit log constants over to our constants
 */
const { Constants: { AuditLogActions } } = require("eris");
Object.keys(AuditLogActions)
    .forEach(k => r.AuditLogActions[k] = AuditLogActions[k]);

module.exports = r;