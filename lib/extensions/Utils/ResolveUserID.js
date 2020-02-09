"use strict";
const User = require("../API/User");
const Member = require("../API/Member");
const {getPrototypeOf} = Object;
/** Resolves an ID from a provided object
 * @param {Message|User|Member} object User, Member, or Message object
 * @returns {String} The ID or passed argument if the object is not one of above objects.
 */
function resolveUserId(object) {
    const Message = require("../API/Message");
    if (getPrototypeOf(object) === Message.prototype) return object.author.id;
    if (getPrototypeOf(object) === User.prototype) return object.id;
    if (getPrototypeOf(object) === Member.prototype) return object.id;
    return object;
}
module.exports = resolveUserId;