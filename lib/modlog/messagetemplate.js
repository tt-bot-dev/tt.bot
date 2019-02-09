const {PunishTexts, PunishColors, PunishTypes} = require("./constants");
module.exports = function generateMessage(type, id, user, issuer, reason, obj) {
    let obje = {
        title: `${PunishTexts[type] ? PunishTexts[type] : "Unknown type"} ${id ? `| ${id}` : ""}`,
        author: {
            name: bot.getTag(user),
            icon_url: user.avatarURL
        },
        fields: [{
            name: "Reason",
            value: reason || `No reason. You can use ${config.prefix}reason <case ID> <reason>`
        }],
        footer: {
            text: `Issued by ${bot.getTag(issuer)}`,
            icon_url: issuer.avatarURL
        },
        color: PunishColors[type] || null
    };
    if (type == PunishTypes.STRIKE_REMOVE) obje.fields.push({
        name: "Strike ID",
        value: obj.id
    });
    return obje;
};