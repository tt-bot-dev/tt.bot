"use strict";
const Constants = {
    PunishTypes: {
        STRIKE:         0,
        KICK:           1,
        SOFTBAN:        2,
        BAN:            3,
        STRIKE_REMOVE:  4,
        REMOVED_STRIKE: 5
    },
    PunishColors: {
        STRIKE:         0xebef0b,
        KICK:           0xefb20a,
        SOFTBAN:        0xef840a,
        BAN:            0xcc1010,
        STRIKE_REMOVE:  0x3acc0e,
        REMOVED_STRIKE: 0x3acc0e,
        [0]:            0xebef0b,
        [1]:            0xefb20a,
        [2]:            0xef840a,
        [3]:            0xcc1010,
        [4]:            0x3acc0e,
        [5]:            0x3acc0e
    },
    PunishTexts: {
        STRIKE:         "Strike",
        KICK:           "Kick",
        SOFTBAN:        "Softban",
        BAN:            "Ban",
        STRIKE_REMOVE:  "Strike remove",
        REMOVED_STRIKE: "Removed strike",
        [0]:            "Strike",
        [1]:            "Kick",
        [2]:            "Softban",
        [3]:            "Ban",
        [4]:            "Strike remove",
        [5]:            "Removed strike"
    }
};
module.exports = Constants;
