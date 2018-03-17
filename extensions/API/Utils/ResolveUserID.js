const Message = require("../Message");
const User = require("../User");
/** Resolves an ID from a provided object
 * @param {Message|User} object User or Message object
 * @returns {String} The ID or passed argument if the object is not one of above objects.
 */
function resolveUserId(object) {
    if (object instanceof Message) return object.author.id;
    if (object instanceof User) return object.id;
    return object;
}
module.exports = resolveUserId;