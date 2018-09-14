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
        /^88268/.test(number)
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
            })
            if (phones.length && !isO({author: {id: msg.guild.ownerID}})) { // Any guilds owned by developers are allowed infinite numbers
                await msg.channel.createMessage("You already have a phone number here, don't you?")
                return;
            }
            const phoneNumber = convertPhoneNumber(additionalArgs.join(" "))
            if (!checkValid(phoneNumber)) {
                await msg.channel.createMessage("Uh... This is not a valid phone number.\nYour number must start with TTBOT (88268), then 9 numbers of your choice.")
                return;
            }
            if (phoneNumber.startsWith("882680") && !isO({author: {id: msg.guild.ownerID}})) {
                await msg.channel.createMessage("Sorry, but phone numbers starting with TTBOT 0 (882680) are reserved for the developers.")
            }
            if (await db.table("phone").get(phoneNumber)) {
                await msg.channel.createMessage("The number already exists, so why register it again?")
            }
            await msg.channel.createMessage("Do you want to make your number to be private? Private numbers show up as registered, however, in the lookup, no information will be available.")
            const private = await askYesNo(msg);
            await db.table("phone").insert({
                id: phoneNumber,
                private,
                channelID: msg.channel.id,
                guildID: msg.guild.id
            })
            await msg.channel.createMessage("Alright, that's all! Your number is now safe and sound.")
        } else if (action === "call") {
            const phoneNumber = convertPhoneNumber(additionalArgs.join(" "))
            if (!checkValid(phoneNumber)) {
                await msg.channel.createMessage("Uh... This is not a valid phone number.")
                return;
            }
            const d = await db.table("phone").filter({
                guildID: msg.guild.id,
                channelID: msg.channel.id
            })
            if (!d.length) {
                await msg.channel.createMessage("We don't do anonymous calls, sorry.")
                return;
            }
            const [currentSideData] = d;
            const otherSideData = await db.table("phone").get(phoneNumber)
            if (!otherSideData) {
                await msg.channel.createMessage("This number is not registered, sorry.")
            }
            await msg.channel.createMessage("Alrighty, they are being called now!");
            try {
                await bot.createMessage(otherSideData.channelID, `Incoming call by ${currentSideData.id} ${!(currentSideData.private) ? `(#${msg.channel.name} at ${msg.guild.name})` : ""}\nType ${config.prefix}pickup to pick up the call. Else type ${config.prefix}hangup. You have 2 minutes to respond.`)
            } catch (_) {
                if (!bot.guilds.get(otherSideData.guildID)) {
                    await msg.channel.createMessage("Call aborted: The bot was removed from the guild you are calling.")
                    const phoneNumbersInDelGuild = await db.table("phone").filter({
                        guildID: otherSideData.guildID
                    })
                    Promise.all(phoneNumbersInDelGuild.map(async ({ id }) => await db.table("phone").get(id).delete())).then(() => {
                        console.log(`Deleted the phone numbers from ${otherSideData.guildID}: ${phoneNumbersInDelGuild.map(d => d.id).join(", ")}`);
                    })
                } else {
                    await msg.channel.createMessage("Call aborted: The bot doesn't have the permissions to write in the channel you are calling.")
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
                })
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
            const phoneNumber = convertPhoneNumber(additionalArgs.join(" "))
            if (!checkValid(phoneNumber)) {
                await msg.channel.createMessage("Uh... This is not a valid phone number.\nYour number must start with TTBOT (88268), then 9 numbers of your choice.")
                return;
            }
            const data = await db.table("phone").get(phoneNumber);
            if (!data) {
                await msg.channel.createMessage("This number is not registered, sorry.");
            }


            const fields = [{
                name: "Private",
                value: data.private ? msg.t("YES") : msg.t("NO"),
                inline: true
            }]
            if (!data.private) {
                if (!bot.guilds.has(data.guildID)) {
                    const phoneNumbersInDelGuild = await db.table("phone").filter({
                        guildID: data.guildID
                    })
                    Promise.all(phoneNumbersInDelGuild.map(async ({ id }) => await db.table("phone").get(id).delete())).then(() => {
                        console.log(`Deleted the phone numbers from ${data.guildID}: ${phoneNumbersInDelGuild.map(d => d.id).join(", ")}`);
                    })
                }
                fields.push({
                    name: "Channel information",
                    value: bot.guilds.get(data.guildID) ? `${bot.getChannel(data.channelID) ? bot.getChannel(data.channelID) : "unknown channel"} at${bot.guilds.get(data.guildID)}` : "The bot was removed from the guild this number owns. This number is free to register now.",
                    inline: true
                })
            }
            await msg.channel.createMessage({
                embed: {
                    author: {
                        name: `Information about the number ${data.id}`
                    },
                    fields,
                    color: 0x008800
                }
            })
            
        }
    },
    name: "phone",
    isCmd: true,
    category: 1,
    display: true,
    description: "Talk with people across Discord.",
};