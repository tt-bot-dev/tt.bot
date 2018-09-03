/**
 * Constants to help people building an extension
 */
const r = {
    ChannelTypes: {
        text: 0,
        dm: 1,
        voice: 2,
        // group: 3, // Bots cannot be added into group DMs
        category: 4
    },
    AuditLogActions: {}
}

/**
 * Copy over Eris' audit log constants over to our constants
 */
const { Constants: { AuditLogActions } } = require("eris");
Object.keys(AuditLogActions)
    .forEach(k => r.AuditLogActions[k] = AuditLogActions[k]);

module.exports = r;