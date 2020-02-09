"use strict";
const {getPrototypeOf} = Object;

const Role = require("../API/Role");
const Message = require("../API/Message");
const User = require("../API/User");
const Member = require("../API/Member");
/** Resolves an ID from a provided object
 * @param {Message|User|Member|Role} object User, Member, Message or Role object
 * @returns {String} The ID or passed argument if the object is not one of above objects.
 */
function resolveUserId(object) {
    if (getPrototypeOf(object) === Message.prototype) return object.author.id;
    if (getPrototypeOf(object) === User.prototype) return object.id;
    if (getPrototypeOf(object) === Member.prototype) return object.id;
    if (getPrototypeOf(object) === Role.prototype) return object.id;
    return object;
}
module.exports = resolveUserId;