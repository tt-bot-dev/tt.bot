"use strict";
const Message = require("../API/Message");

const {getPrototypeOf} = Object;
/** Resolves an ID from a provided object
 * @param {Message} object Message object
 * @returns {String} The ID or passed argument if the object is not one of above objects.
 */
function resolveUserId(object) {
    if (getPrototypeOf(object) === Message.prototype) return object.id;
    return object;
}
module.exports = resolveUserId;