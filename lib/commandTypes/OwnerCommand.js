"use strict";
const { Command } = require("sosamba");
const config = require("../../config");

/**
 * Represents an owner-only command
 */
class OwnerCommand extends Command {
    permissionCheck(ctx) {
        return Array.isArray(config.oid)
            ? config.oid.includes(ctx.author.id)
            : ctx.author.id === config.oid;
    }
}

module.exports = OwnerCommand;