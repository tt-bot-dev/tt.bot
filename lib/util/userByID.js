"use strict";
const userByID = async (val, ctx) => await ctx.sosamba.getUserWithoutRESTMode(val);
userByID.typeHint = "User.byID";
module.exports = userByID;