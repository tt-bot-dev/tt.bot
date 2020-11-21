"use strict";
/**
 * Source: https://github.com/discordjs/discord.js/blob/95b2dd3fe63ec9b6c7cec4f63f8276f4d907f228/src/util/DataResolver.js#L29-L34
 * Regex modified to match the (new) discord.com domain. 
 * 
 * This code is licensed under Apache License 2.0.
 * The license can be viewed here:
 * https://github.com/discordjs/discord.js/blob/95b2dd3fe63ec9b6c7cec4f63f8276f4d907f228/LICENSE
 */
module.exports = data => {
    const inviteRegex = /discord(?:(?:app)?\.com\/invite|\.gg(?:\/invite)?)\/([\w-]{2,255})/i;
    const match = inviteRegex.exec(data);
    if (match && match[1]) return match[1];
    return data;
};
