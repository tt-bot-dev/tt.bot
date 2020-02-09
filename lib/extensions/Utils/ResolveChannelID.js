"use strict";
const Channel = require("../API/Channel");
const CategoryChannel = require("../API/CategoryChannel");
const TextChannel = require("../API/TextChannel");
const VoiceChannel = require("../API/VoiceChannel");
const {getPrototypeOf} = Object;
/** Resolves an ID from a provided object
 * @param {Channel} object A channel
 * @returns {String} The ID or passed argument if the object is not one of above objects.
 */
function resolveUserId(object) {
    if (getPrototypeOf(object) === Channel.prototype) return object.id;
    if (getPrototypeOf(object) === CategoryChannel.prototype) return object.id;
    if (getPrototypeOf(object) === TextChannel.prototype) return object.id;
    if (getPrototypeOf(object) === VoiceChannel.prototype) return object.id;
    return object;
}
module.exports = resolveUserId;
