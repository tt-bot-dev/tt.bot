"use strict";
const {ExtensionFlags} = require("../API/Constants");
module.exports = (extension, privilege, error = true) => {
    if (!Object.prototype.hasOwnProperty.call(ExtensionFlags, privilege)) return error ? undefined : true;
    if (extension.flags & ExtensionFlags[privilege]) return error ? undefined : true;
    if (error) throw new Error(`Missing permissions to run this action. Please enable the "${privilege}" flag or remove conflicting code.`);
};