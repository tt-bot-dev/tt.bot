"use strict";
module.exports = (extension, r) => `Extension ID ${extension.id}: ${r || "reason not specified"}`;