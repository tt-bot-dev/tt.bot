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
        SNEKFETCH_ENABLED: 1
    }
};

/**
 * Copy over Eris' audit log constants over to our constants
 */
const { Constants: { AuditLogActions } } = require("eris");
Object.keys(AuditLogActions)
    .forEach(k => r.AuditLogActions[k] = AuditLogActions[k]);

module.exports = r;