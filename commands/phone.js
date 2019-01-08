const askYesNo = require("../util/askYesNo");
// For now use the old call system
const speakerphoneEmitter = require("../speakerphone/emitter");

function convertPhoneNumber(input) {
    return input
        .replace(/(a|b|c)/ig, "2")
        .replace(/(d|e|f)/ig, "3")
        .replace(/(g|h|i)/ig, "4")
        .replace(/(j|k|l)/ig, "5")
        .replace(/(m|n|o)/ig, "6")
        .replace(/(p|q|r|s)/ig, "7")
        .replace(/(t|u|v)/ig, "8")
        .replace(/(w|x|y|z)/ig, "9")
        .replace(/(-|\(|\))/g, "")
        .replace(/\s+/g, "");
}

function checkValid(number) {
    return !isNaN(number) &&
        number.length === 14 /* TTBOT and the 9 digit number*/ &&
        /^88268/.test(number);
}

module.exports = {
    exec: async function (msg, args) {
        if (!args) {
            msg.channel.createMessage(msg.t("ARGS_MISSING"));
            return;
        }
        const [action, ...additionalArgs] = args.split(" ");
        if (action === "register") {
            if (!bot.isAdmin(msg.member)) return;
            const phones = await db.table("phone").filter({
                guildID: msg.guild.id
            });
            if (phones.length && !isO({author: {id: msg.guild.ownerID}})) { // Any guilds owned by developers are allowed infinite numbers
                await msg.channel.createMessage(msg.t("ALREADY_HAVE_NUMBER"));
                return;
            }
            const phoneNumber = convertPhoneNumber(additionalArgs.join(" "));
            if (!checkValid(phoneNumber)) {
                await msg.channel.createMessage(msg.t("NUMBER_INVALID", true));
                return;
            }
            if (phoneNumber.startsWith("882680") && !isO({author: {id: msg.guild.ownerID}})) {
                await msg.channel.createMessage(msg.t("NUMBER_RESERVED"));
                return;
            }
            if (await db.table("phone").get(phoneNumber)) {
                await msg.channel.createMessage(msg.t("NUMBER_EXISTS"));
                return;
            }
            await msg.channel.createMessage(msg.t("QUESTION_NUMBER_PRIVATE"));
            const isPrivate = await askYesNo(msg);
            await db.table("phone").insert({
                id: phoneNumber,
                private: isPrivate,
                channelID: msg.channel.id,
                guildID: msg.guild.id
            });
            await msg.channel.createMessage(msg.t("NUMBER_CREATED"));
        } else if (action === "call") {
            const phoneNumber = convertPhoneNumber(additionalArgs.join(" "));
            if (!checkValid(phoneNumber)) {
                await msg.channel.createMessage(msg.t("NUMBER_INVALID"));
                return;
            }
            const d = await db.table("phone").filter({
                guildID: msg.guild.id,
                channelID: msg.channel.id
            });
            if (!d.length) {
                await msg.channel.createMessage(msg.t("CALLER_NO_NUMBER"));
                return;
            }
            const [currentSideData] = d;
            const otherSideData = await db.table("phone").get(phoneNumber);
            if (!otherSideData) {
                await msg.channel.createMessage(msg.t("NUMBER_NONEXISTANT"));
                return;
            }
            await msg.channel.createMessage(msg.t("CALLING"));
            try {
                await bot.createMessage(otherSideData.channelID, `Incoming call by ${currentSideData.id} ${!(currentSideData.private) ? `(#${msg.channel.name} at ${msg.guild.name})` : ""}\nType ${config.prefix}pickup to pick up the call. Else type ${config.prefix}hangup. You have 2 minutes to respond.`);
            } catch (_) {
                if (!bot.guilds.get(otherSideData.guildID)) {
                    await msg.channel.createMessage(msg.t("CALL_ABORTED_BOT_REMOVED"));
                    const phoneNumbersInDelGuild = await db.table("phone").filter({
                        guildID: otherSideData.guildID
                    });
                    Promise.all(phoneNumbersInDelGuild.map(async ({ id }) => await db.table("phone").get(id).delete())).then(() => {
                        console.log(`Deleted the phone numbers from ${otherSideData.guildID}: ${phoneNumbersInDelGuild.map(d => d.id).join(", ")}`);
                    });
                } else {
                    await msg.channel.createMessage(msg.t("CALL_ABORTED_NO_PERMISSIONS"));
                }
                return;
            }
            try {
                let [msgAns] = await bot.waitForEvent("messageCreate", 2 * 60e3, m => {
                    if (m.author.bot) return false;
                    if (m.guild.id !== otherSideData.guildID) return false;
                    if (m.channel.id !== otherSideData.channelID) return false;
                    if (m.content !== `${config.prefix}pickup`&& m.content !== `${config.prefix}hangup`) return false;
                    return true;
                });
                if (msgAns.content === `${config.prefix}pickup`) {
                    new speakerphoneEmitter(msg.channel, bot.getChannel(otherSideData.channelID), currentSideData, otherSideData);
                } else {
                    [otherSideData.channelID, msg.channel.id].forEach(c => bot.createMessage(c, "The call was hung up."));
                }
            } catch (_) {
                [otherSideData.channelID, msg.channel.id].forEach(c => bot.createMessage(c, "The call timed out."));
                return;
            }
        } else if (action === "lookup") {
            const phoneNumber = convertPhoneNumber(additionalArgs.join(" "));
            if (!checkValid(phoneNumber)) {
                await msg.channel.createMessage(msg.t("NUMBER_INVALID", true));
                return;
            }
            const data = await db.table("phone").get(phoneNumber);
            if (!data) {
                await msg.channel.createMessage(msg.t("NUMBER_NONEXISTANT"));
                return;
            }


            const fields = [{
                name: msg.t("PRIVATE_NUMBER"),
                value: data.private ? msg.t("YES") : msg.t("NO"),
                inline: true
            }];
            if (!data.private) {
                let isOnServer = true;
                if (!bot.guilds.has(data.guildID)) {
                    isOnServer = false;
                    const phoneNumbersInDelGuild = await db.table("phone").filter({
                        guildID: data.guildID
                    });
                    Promise.all(phoneNumbersInDelGuild.map(async ({ id }) => await db.table("phone").get(id).delete())).then(() => {
                        console.log(`Deleted the phone numbers from ${data.guildID}: ${phoneNumbersInDelGuild.map(d => d.id).join(", ")}`);
                    });
                }
                const c = bot.getChannel(data.channelID)
                fields.push({
                    name: msg.t("CHANNEL_INFORMATION"),
                    value: isOnServer ? msg.t("CHANNEL_INFORMATION_VALUE", c, bot.guilds.get(data.guildID)) : msg.t("NUMBER_AVAILABLE"),
                    inline: true
                });
            }
            await msg.channel.createMessage({
                embed: {
                    author: {
                        name: msg.t("NUMBER_INFORMATION", data.id)
                    },
                    fields,
                    color: 0x008800
                }
            });
            
        } else if (action === "delete") {
            
            const phoneNumber = convertPhoneNumber(additionalArgs.join(" "));
            if (!checkValid(phoneNumber)) {
                await msg.channel.createMessage(msg.t("NUMBER_INVALID", true));
                return;
            }
            const data = await db.table("phone").get(phoneNumber);
            if (!data || (!isO(msg) && (data && (data.guildID !== msg.guild.id)))) {
                await msg.channel.createMessage(msg.t("NUMBER_NONEXISTANT"));
                return;
            }
            const m = await msg.channel.createMessage(msg.t("QUESTION_DELETE_NUM", data.id));

            if (await askYesNo(msg)) {
                await db.table("phone").get(phoneNumber).delete();
                await m.delete();
                await msg.channel.createMessage(msg.t("NUMBER_DELETED"))
            } else {
                await m.delete();
                await msg.channel.createMessage(msg.t("OP_CANCELLED"))
            }
        } else {
            await cmds.help.exec(msg, "phone");
        }
    },
    name: "phone",
    isCmd: true,
    category: 1,
    display: true,
    description: "Talk with people across Discord.",
    args: "<register|call|delete> <number>"
};