"use strict";
const userByID = async (val, ctx) => await ctx.sosamba.getUserWithoutRESTMode(val);
Object.defineProperty(userByID, "name", {
    value: "User.byID",
    writable: false
});
module.exports = userByID;