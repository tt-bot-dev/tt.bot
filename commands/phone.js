const { Command, SerializedArgumentParser, ParsingError } = require("sosamba");
const { prototype: { permissionCheck: isOwner } } = require("../lib/OwnerCommand");
const config = require("../config");
const speakerPhone = require("../lib/speakerPhone.v4");
const RegisterSymbol = Symbol("tt.bot.phone.register");
const CallSymbol = Symbol("tt.bot.phone.call");
const LookupSymbol = Symbol("tt.bot.phone.lookup");
const DeleteSymbol = Symbol("tt.bot.phone.delete");


const convertNumber = input => input
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
const checkValidNumber = n => !isNaN(n) &&
    n.length === 14 && // TTBOT and the 9-digit number
    /^88268/.test(n);

class PhoneCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "phone",
            argParser: new SerializedArgumentParser(sosamba, {
                allowQuotedString: true,
                args: [{
                    name: "action",
                    type: (val, ctx) => {
                        if (val === "register" && sosamba.isAdmin(ctx.member)) return RegisterSymbol;
                        if (val === "call") return CallSymbol;
                        if (val === "lookup") return LookupSymbol;
                        if (val === "delete" && sosamba.isAdmin(ctx.member)) return DeleteSymbol;
                        throw new ParsingError("Invalid action");
                    },
                    description: "the action to do",
                }, {
                    name: "number",
                    type: async (val, ctx) => {
                        const num = convertNumber(val);
                        console.log(num);
                        if (!checkValidNumber(num))
                            throw new ParsingError(await ctx.t("NUMBER_INVALID", true));
                        return num;
                    },
                    rest: true
                }]
            }),
            description: "Talk with people across Discord."
        });

        this.speakerPhone = sosamba.messageListeners.add(new speakerPhone(sosamba));
    }

    async run(ctx, [action, number]) {
        if (action === RegisterSymbol) {
            const phones = await ctx.db.getGuildPhoneNumbers(ctx.guild.id);
            if (phones.length > 0 && !isOwner({
                author: {
                    id: ctx.guild.ownerID
                }
            })) {
                await ctx.send(await ctx.t("ALREADY_HAVE_NUMBER"));
                return;
            }

            if (number.startsWith("882680") && !isOwner({
                author: {
                    id: ctx.guild.ownerID
                }
            })) {
                await ctx.send(await ctx.t("NUMBER_RESERVED"));
                return;
            }

            if (await ctx.db.getPhoneNumber(number)) {
                await ctx.send(await ctx.t("NUMBER_EXISTS"));
                return;
            }

            await ctx.send(await ctx.t("QUESTION_NUMBER_PRIVATE"));
            const isPrivate = await ctx.askYesNo();
            await ctx.db.createPhoneNumber({
                id: number,
                private: isPrivate,
                channelID: ctx.channel.id,
                guildID: ctx.guild.id
            });
            await ctx.send(await ctx.t("NUMBER_CREATED"));
        } else if (action === CallSymbol) {
            const [thisChannelNumber] = await ctx.db.getChannelPhoneNumbers(ctx.guild.id, ctx.channel.id);
            if (!thisChannelNumber) {
                await ctx.send(await ctx.t("CALLER_NO_NUMBER"));
                return;
            }
            const otherSideNumber = await ctx.db.getPhoneNumber(number);
            if (!otherSideNumber) {
                await ctx.send(await ctx.t("NUMBER_NONEXISTANT"));
                return;
            }

            await ctx.send(await ctx.t("CALLING"));

            try {
                await this.sosamba.createMessage(otherSideNumber.channelID,
                    `Incoming call by ${thisChannelNumber.id} ${!thisChannelNumber.private ? `(#${ctx.channel.name} at ${ctx.guild.name})` : ""}\nType \`${config.prefix}pickup\` to pick up the call. Else, type \`${config.prefix}hangup\`. You have 2 minutes to pick up the call, else the call will be automatically hung up.`);
                try {
                    const answer = await ctx.waitForAnyMessage(otherSideNumber.channelID, ctx => console.log(ctx.msg.content) ||
                        (ctx.msg.content === `${config.prefix}pickup`
                            || ctx.msg.content === `${config.prefix}hangup`),
                    2 * 60e3);

                    if (answer.msg.content === `${config.prefix}pickup`) {
                        this.speakerPhone.addChannels(ctx.channel, this.sosamba.getChannel(otherSideNumber.channelID), thisChannelNumber, otherSideNumber);
                    } else {
                        for (const cID of [otherSideNumber.channelID, ctx.channel.id]) {
                            await this.sosamba.createMessage(cID, "The call was hung up.");
                        }
                    }
                } catch (err) {
                    console.error(err);
                    for (const cID of [otherSideNumber.channelID, ctx.channel.id]) {
                        await this.sosamba.createMessage(cID, "The call timed out.");
                    }
                }
            } catch {
                if (!this.sosamba.guilds.has(otherSideNumber.guildID)) {
                    await ctx.send(await ctx.t("CALL_ABORTED_BOT_REMOVED"));
                    const phoneNumbers = await ctx.db.getGuildPhoneNumbers(otherSideNumber.guildID);
                    await Promise.all(phoneNumbers.map(async ({ id }) => ctx.db.deletePhoneNumber(id)));
                    return;
                } else {
                    await ctx.send(await ctx.t("CALL_ABORTED_NO_PERMISSIONS"));
                    return;
                }

            }
        } else if (action === LookupSymbol) {
            const data = await ctx.db.getPhoneNumber(number);

            if (!data) {
                await ctx.send(await ctx.t("NUMBER_NONEXISTANT"));
                return;
            }

            const fields = [{
                name: await ctx.t("PRIVATE_NUMBER"),
                value: data.private ? await ctx.t("YES")
                    : await ctx.t("NO"),
                inline: true
            }];

            const isOnServer = this.sosamba.guilds.has(data.guildID);
            if (!isOnServer) {
                const phoneNumbersInDelGuild = await ctx.db.getGuildPhoneNumbers(data.guildID);
                await Promise.all(phoneNumbers.map(async ({ id }) => ctx.db.deletePhoneNumber(id)));
                console.log(`Deleted the phone numbers from ${data.guildID}: ${phoneNumbersInDelGuild.map(d => d.id).join(", ")}`);
            }

            const c = this.sosamba.getChannel(data.channelID);
            if (!data.private || !isOnServer) fields.push({
                name: await ctx.t("CHANNEL_INFORMATION"),
                value: isOnServer ? await ctx.t("CHANNEL_INFORMATION_VALUE", c, {
                    name: this.sosamba.escapeMarkdown(c.guild.name)
                }) : await ctx.t("NUMBER_AVAILABLE"),
                inline: true
            });

            await ctx.send({
                embed: {
                    author: {
                        name: await ctx.t("NUMBER_INFORMATION", data.id)
                    },
                    fields,
                    color: 0x008800
                }
            });
        } else if (action === DeleteSymbol) {
            const phone = ctx.db.getPhoneNumber(number);
            if (!phone || (!isOwner(ctx)
                && (phone && (phone.guildID !== ctx.guild.id)))
            ) {
                await ctx.send(await ctx.t("NUMBER_NONEXISTANT"));
                return;
            }
            await ctx.send(await ctx.t("QUESTION_DELETE_NUM", number));

            if (await ctx.askYesNo()) {
                await ctx.db.deletePhoneNumber(number);
                await ctx.send(await ctx.t("NUMBER_DELETED"));
            } else {
                await ctx.send(await ctx.t("OP_CANCELLED"));
            }
        }
    }
}

module.exports = PhoneCommand;