"use strict";
const {PunishTexts, PunishColors, PunishTypes} = require("./constants");
const config = require("../../config");
module.exports = function generateMessage(type, id, user, issuer, reason, obj, bot) {
    let obje = {
        title: `${PunishTexts[type] ? PunishTexts[type] : "Unknown type"} ${id ? `| ${id}` : ""}`,
        author: {
            name: bot.getTag(user),
            icon_url: user.avatarURL
        },
        fields: [{
            name: "Reason",
            value: reason || "No reason provided."
        }],
        footer: {
            text: `Issued by ${bot.getTag(issuer)} | Use ${config.prefix}reason ${id} <reason> to edit reason`,
            icon_url: issuer.avatarURL
        },
        color: PunishColors[type] || null
    };
    if (type === PunishTypes.STRIKE_REMOVE) obje.fields.push({
        name: "Strike ID",
        value: obj.id
    });
    return obje;
};