"use strict";
const Role = require("../API/Role");
const {getPrototypeOf} = Object;

/** Resolves an ID from a provided object
 * @param {Role} object Role object
 * @returns {String} The ID or passed argument if the object is not one of above objects.
 */
function resolveRoleId(object) {
    if (getPrototypeOf(object) === Role.prototype) return object.id;
    return object;
}

module.exports = resolveRoleId;