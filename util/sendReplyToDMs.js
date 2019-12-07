"use strict";
const { Eris: { User, Member } } = require("sosamba");
module.exports = async (userOrMember, ...args) => {
    let dmChannel;
    if (userOrMember instanceof User) {
        dmChannel = await userOrMember.getDMChannel();
    }
    else if (userOrMember instanceof Member) {
        dmChannel = await userOrMember.user.getDMChannel();
    }
    return dmChannel.createMessage(...args);
};