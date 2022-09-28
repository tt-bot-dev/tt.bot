/**
 * Copyright (C) 2022 tt.bot dev team
 * 
 * This file is part of tt.bot.
 * 
 * tt.bot is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * tt.bot is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with tt.bot.  If not, see <http://www.gnu.org/licenses/>.
 */


import { Command, Eris } from "sosamba";
import OwnerCommand from "../lib/commandTypes/OwnerCommand.mjs";
const { prototype: { permissionCheck: isOwner } } = OwnerCommand;
import ttbotPackage, { sosambaPackage } from "../lib/package.mjs";
import { t } from "../lib/util.mjs";

const { version: sosambaVersion } = sosambaPackage;

const { Constants: { ApplicationCommandOptionTypes, ComponentTypes, ButtonStyles } } = Eris;
 
 
const convertNumber = (/** @type {string} */ input) => input
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
const checkValidNumber = (/** @type {string} */ n) => !isNaN(n) &&
     n.length === 14 && // TTBOT and the 9-digit number
     n.startsWith("88268");

/**
 * @typedef {object} PhoneCallData
 * @prop {string} id
 * @prop {boolean} private
 * @prop {string} channelID
 * @prop {string} guildID
 */
 
class PhoneCommand extends Command {
    /** @type {Map<string, { caller: PhoneCallData, otherSide: PhoneCallData }>} */
    phoneCalls = new Map();

    constructor(...args) {
        super(...args, {
            name: "phone",
            description: "Talk with people across Discord.",
            guildOnly: true,
            args: [
                {
                    name: "register",
                    description: "Registers a phone number in this channel",
                    type: ApplicationCommandOptionTypes.SUB_COMMAND,
                    options: [{
                        name: "number",
                        description: "The number to register",
                        type: ApplicationCommandOptionTypes.STRING,
                        required: true,
                    }],
                },
                {
                    name: "call",
                    description: "Calls a phone number",
                    type: ApplicationCommandOptionTypes.SUB_COMMAND,
                    options: [{
                        name: "number",
                        description: "The number to call",
                        type: ApplicationCommandOptionTypes.STRING,
                        required: true,
                    }],
                },
                {
                    name: "lookup",
                    description: "Finds information about a phone number",
                    type: ApplicationCommandOptionTypes.SUB_COMMAND,
                    options: [{
                        name: "number",
                        description: "The number to look the details up for (defaults to the phone number of this channel)",
                        type: ApplicationCommandOptionTypes.STRING,
                        required: false,
                    }],
                },
                {
                    name: "delete",
                    description: "Deletes a phone number from this server",
                    type: ApplicationCommandOptionTypes.SUB_COMMAND,
                    options: [{
                        name: "number",
                        description: "The number to delete",
                        type: ApplicationCommandOptionTypes.STRING,
                        required: true,
                    }],
                },
                {
                    name: "hangup",
                    description: "Hangs a phone call up",
                    type: ApplicationCommandOptionTypes.SUB_COMMAND,
                    options: [],
                },
                {
                    name: "reply",
                    description: "Sends a message to the other side",
                    type: ApplicationCommandOptionTypes.SUB_COMMAND,
                    options: [{
                        name: "message",
                        description: "The message to send over",
                        type: ApplicationCommandOptionTypes.STRING,
                        required: true,
                    }],
                },
            ],
            
        });
 
        // this.speakerPhone = sosamba.messageListeners.add(new PhoneMessageListener(sosamba));
    }
     
    async checkHasNumber(ctx, number) {
        if (!number) {
            await ctx.send({
                embed: {
                    title: ":x: Argument required",
                    description: "The argument `number` is required.",
                    color: 0xFF0000,
                    footer: {
                        text: `Sosamba v${sosambaVersion}`,
                    },
                },
            });
            return;
        }
        return true;
    }

    async convertNumber(ctx, number) {
        const numConverted = convertNumber(number);

        if (!checkValidNumber(numConverted)) {
            await ctx.send({
                embeds: [{
                    title: `:x: ${await t(ctx, "NUMBER_INVALID")}`,
                    description: await t(ctx, "NUMBER_INVALID_HINT"),
                    color: 0xFF0000,
                }],
                flags: 64,
            });

            return;
        }

        return numConverted;
    }
 
    async run(ctx, { number, message }) {

        switch (ctx.subcommand) {
        case "register": {
            if (!this.sosamba.isAdmin(ctx.member)) {
                await ctx.send({
                    embeds: [{
                        title: ":x: Missing permissions",
                        description: "Registering phone numbers is restricted to administrators.",
                        color: 0xFF0000,
                        footer: {
                            text: "Contact the server administrators to register a phone number!",
                        },
                    }],
                    flags: 64,
                });

                return;
            }

            const num = await this.convertNumber(ctx, number);

            if (!num) return;

            const phones = await this.sosamba.db.getGuildPhoneNumbers(ctx.guild.id);
            if (phones.length > 0 && !isOwner({
                author: {
                    id: ctx.guild.ownerID,
                },
            })) {
                await ctx.send({
                    embeds: [{
                        title: ":x: Cannot register this number",
                        description: await t(ctx, "ALREADY_HAVE_NUMBER"),
                        color: 0xFF0000,
                    }],
                    flags: 64,
                });
                return;
            }
 
            if (num.startsWith("882680") && !isOwner({
                author: {
                    id: ctx.guild.ownerID,
                },
            })) {
                await ctx.send({
                    embeds: [{
                        title: ":x: Cannot register this number",
                        description: await t(ctx, "NUMBER_RESERVED"),
                        color: 0xFF0000,
                    }],
                });
                return;
            }
 
            if (await this.sosamba.db.getPhoneNumber(num)) {
                await ctx.send({
                    embeds: [{
                        title: ":x: Cannot register this number",
                        description: await t(ctx, "NUMBER_EXISTS"),
                        color: 0xFF0000,
                    }],
                });
                return;
            }

            await ctx.send({
                embeds: [{
                    title: ":question: Would you like to create a private number?",
                    // todo add note about defaulting to public
                    description: await t(ctx, "QUESTION_NUMBER_PRIVATE"),
                    color: 0xFFFF00,
                }],
                components: [{
                    type: ComponentTypes.ACTION_ROW,
                    components: ctx.createYesNoButtons(),
                }],
            });

            const isPrivate = await ctx.askYesNo(true);

            await this.sosamba.db.createPhoneNumber({
                id: num,
                private: isPrivate.response,
                channelID: ctx.channel.id,
                guildID: ctx.guild.id,
            });

            const content = {
                embeds: [{
                    title: ":white_check_mark: Phone number created",
                    description: "Try making a phone call using `/phone call`!",
                    color: 0x008800,
                }],
                components: [],
            };

            if (isPrivate.context) {
                await isPrivate.context.interaction.editParent(content);
            } else {
                await ctx.send(content);
            }

            break;
        }

        case "delete": {
            if (!this.sosamba.isAdmin(ctx.member)) {
                await ctx.send({
                    embeds: [{
                        title: ":x: Missing permissions",
                        description: "Deleting phone numbers is restricted to administrators.",
                        color: 0xFF0000,
                    }],
                    flags: 64,
                });

                return;
            }

            const num = await this.convertNumber(ctx, number);

            if (!num) return;

            const phone = await this.sosamba.db.getPhoneNumber(num);
            if (!phone) {
                await ctx.send({
                    embeds: [{
                        title: ":x: Cannot delete phone number",
                        description: await t(ctx, "NUMBER_NONEXISTANT"),
                        color: 0xFF0000,
                    }],
                    flags: 64,
                });
                return;
            }

            if (!isOwner(ctx) && phone.guildID !== ctx.guild.id) {
                await ctx.send({
                    embeds: [{
                        title: ":x: Cannot delete phone number",
                        description: await t(ctx, "NUMBER_NONEXISTANT"),
                        color: 0xFF0000,
                    }],
                    flags: 64,
                });
                return;
            }

            await ctx.send({
                embeds: [{
                    title: ":question: Would you like to delete the phone number?",
                    description: await t(ctx, "QUESTION_DELETE_NUM", { number: num }),
                    color: 0xFF0000,
                }],
                components: [{
                    type: ComponentTypes.ACTION_ROW,
                    components: ctx.createYesNoButtons(),
                }],
            });

            const resp = await ctx.askYesNo(true);


            if (resp.response) {
                await this.sosamba.db.deletePhoneNumber(num);

                await resp.context.interaction.editParent({
                    embeds: [{
                        title: ":white_check_mark: Phone number deleted successfully.",
                        description: `Anyone can register the number ${num} from now on.`,
                        color: 0x008800,
                    }],
                    components: [],
                });
            } else {
                const content = {
                    embeds: [],
                    components: [],
                    content: await t(ctx, "OP_CANCELLED"),
                };

                if (resp.context) {
                    await resp.context.interaction.editParent(content);
                } else {
                    await ctx.interaction.editOriginalMessage(content);
                }
            }
            break;
        }

        case "lookup": {
            let data;
            if (number) {
                const num = await this.convertNumber(ctx, number);
        
                if (!num) return;
        
        
                data = await this.sosamba.db.getPhoneNumber(num);
            } else [data] = await this.sosamba.db.getChannelPhoneNumbers(ctx.guild.id, ctx.channel.id);
 
            if (!data) {
                await ctx.send({
                    embeds: [{
                        title: ":x: Cannot look this phone number up",
                        description: await t(ctx, "NUMBER_NONEXISTANT"),
                        color: 0xFF0000,
                    }],
                });
                return;
            }
 
            const fields = [{
                name: await t(ctx, "PRIVATE_NUMBER"),
                value: data.private ? await t(ctx, "YES")
                    : await t(ctx, "NO"),
                inline: true,
            }];
 
            const isOnServer = this.sosamba.guilds.has(data.guildID);
            if (!isOnServer) {
                const phoneNumbersInDelGuild = await this.sosamba.db.getGuildPhoneNumbers(data.guildID);
                await Promise.all(phoneNumbersInDelGuild.map(async ({ id }) => this.sosamba.db.deletePhoneNumber(id)));
                this.log.info(`Deleted the phone numbers from ${data.guildID}: ${phoneNumbersInDelGuild.map(d => d.id).join(", ")}`);
            }
 
            const c = this.sosamba.getChannel(data.channelID);
            if (!data.private || !isOnServer) fields.push({
                name: await t(ctx, "CHANNEL_INFORMATION"),
                value: isOnServer ? await t(ctx, "CHANNEL_INFORMATION_VALUE", {
                    channel: this.sosamba.escapeMarkdown(`#${c.name}`),
                    guild: this.sosamba.escapeMarkdown(c.guild.name),
                }) : await t(ctx, "NUMBER_AVAILABLE"),
                inline: true,
            });
 
            await ctx.send({
                embeds: [{
                    author: {
                        name: await t(ctx, "NUMBER_INFORMATION", {
                            number: data.id,
                        }),
                    },
                    fields,
                    color: 0x008800,
                }],
            });

            break;
        }
        case "call": {
            if (!await this.checkHasNumber(ctx, number)) return;
            const [thisChannelNumber] = await this.sosamba.db.getChannelPhoneNumbers(ctx.guild.id, ctx.channel.id);
            if (!thisChannelNumber) {
                await ctx.send({
                    embeds: [{
                        title: ":x: Cannot call this number",
                        description: await t(ctx, "CALLER_NO_NUMBER"),
                        color: 0xFF0000,
                        footer: {
                            text: "You can register a phone number using /phone register.",
                        },
                    }],
                    flags: 64,
                });
                    
                return;
            }
            const num = await this.convertNumber(ctx, number);

            if (!num) return;

            const otherSideNumber = await this.sosamba.db.getPhoneNumber(num);
            if (!otherSideNumber) {
                await ctx.send({
                    embeds: [{
                        title: ":x: Cannot call this number",
                        description: await t(ctx, "NUMBER_NONEXISTANT"),
                        color: 0xFF0000,
                    }],
                    flags: 64,
                });
                return;
            }

            if (otherSideNumber.channelID === thisChannelNumber.channelID) {
                await ctx.send({
                    embeds: [{
                        title: ":x: Cannot call this number",
                        description: "This number is registered to the same channel as the number you're calling from.",
                        color: 0xFF0000,
                    }],
                    flags: 64,
                });

                return;
            }

            if (this.phoneCalls.has(thisChannelNumber.channelID)) {
                await ctx.send({
                    embeds: [{
                        title: ":x: Cannot call this number",
                        description: "You are in a call already.",
                        footer: {
                            text: "Hang the current call up with /phone hangup and try again.",
                        },
                        color: 0xFF0000,
                    }],
                    flags: 64,
                });

                return;
            }

            if (this.phoneCalls.has(otherSideNumber.channelID)) {
                await ctx.send({
                    embeds: [{
                        title: ":x: Cannot call this number",
                        description: "The other side is busy.",
                        footer: {
                            text: "Try calling them again later!",
                        },
                        color: 0xFF0000,
                    }],
                    flags: 64,
                });

                return;
            }
 
            await ctx.send({
                embeds: [{
                    title: `📞 ${await t(ctx, "CALLING")}`,
                    description: "Please wait until the other side picks up…",
                    color: 0x008800,
                }],
            });

            const callerString = `${thisChannelNumber.id} ${!thisChannelNumber.private ? `(#${ctx.channel.name} at ${ctx.guild.name})` : ""}`;

            try {
                await this.sosamba.createMessage(otherSideNumber.channelID, {
                    embeds: [{
                        title: "📞 Incoming call",
                        description: callerString,
                        ...thisChannelNumber.private ? {} : {
                            thumbnail: {
                                url: ctx.guild.iconURL,
                            },
                        },
                        footer: {
                            text: "The call will time out in 2 minutes.",
                        },
                        color: 0xFFFF00,
                    }],
                    components: [{
                        type: ComponentTypes.ACTION_ROW,
                        components: [
                            ctx.withButton({
                                custom_id: `phone:${thisChannelNumber.id}:pickup`,
                                style: ButtonStyles.SUCCESS,
                                label: "Pickup",
                            }),
                            ctx.withButton({
                                custom_id: `phone:${thisChannelNumber.id}:hangup`,
                                style: ButtonStyles.DANGER,
                                label: "Reject",
                            }),
                        ],
                    }],
                });

                try {
                    const answer = await ctx.waitForAnyComponent(c => [
                        `phone:${thisChannelNumber.id}:pickup`,
                        `phone:${thisChannelNumber.id}:hangup`,
                    ].includes(c.componentData), 120000);

                    await answer.interaction.editParent({
                        components: [],
                    });

                    switch (answer.componentData) {
                    case `phone:${thisChannelNumber.id}:pickup`: {
                        if (this.phoneCalls.has(otherSideNumber.channelID)) {
                            await Promise.all(
                                [
                                    this.sosamba.createMessage(otherSideNumber.channelID, {
                                        embeds: [{
                                            title: ":cry: Cannot pick this call up",
                                            description: "You currently are in a call already. Hence, the call was hung up.",
                                            footer: {
                                                text: "Want to call the other side again? Use the /phone call command.",
                                            },
                                            color: 0xFF0000,
                                        }],
                                    }),
                                    this.sosamba.createMessage(ctx.channel.id, {
                                        embeds: [{
                                            title: ":wave: The call was hung up",
                                            description: "Want to call the other side again? Use the /phone call command.",
                                            color: 0xFF0000,
                                        }],
                                    }),
                                ],
                            );

                            return;
                        }

                        await this.addChannelsToSpeakerPhone(
                            thisChannelNumber,
                            otherSideNumber,
                        );
                        break;
                    }

                    case `phone:${thisChannelNumber.id}:hangup`: {
                        await Promise.all(
                            [otherSideNumber.channelID, ctx.channel.id]
                                .map(cID => this.sosamba.createMessage(cID, {
                                    embeds: [{
                                        title: ":wave: The call was hung up",
                                        description: "Want to call the other side again? Use the /phone call command.",
                                        color: 0xFF0000,
                                    }],
                                })),
                        );

                        return;
                    }
                    }

                } catch (err) {
                    if (err.message === "Timed out") {
                        await Promise.all(
                            [otherSideNumber.channelID, ctx.channel.id]
                                .map(cID => this.sosamba.createMessage(cID, {
                                    embeds: [{
                                        title: `:hourglass: The call ${cID === otherSideNumber.channelID ? `from ${thisChannelNumber.id}` : `to ${otherSideNumber.id}`} timed out`,
                                        description: "Try calling them again later.",
                                        footer: {
                                            text: "To call other people, use the /phone call command.",
                                        },
                                        color: 0xFFFF00,
                                    }],
                                })),
                        );
                    } else {
                        await Promise.all(
                            [otherSideNumber.channelID, ctx.channel.id]
                                .map(cID => this.sosamba.createMessage(cID, {
                                    embeds: [{
                                        title: ":x: Cannot proceed with the call",
                                        description: `I am unable to proceed with the call any further due to a coding error.\n\`\`\`js\n${err.stack}\n\`\`\``,
                                        color: 0xFF0000,
                                        footer: {
                                            text: `Please report this issue on our support server or on GitHub. | tt.bot v${ttbotPackage.version} running on Sosamba v${sosambaPackage.version}`,
                                        },
                                    }],
                                })),
                        );

                        // remove any ghost call entries that may occur
                        this.phoneCalls.delete(ctx.channel.id);
                        this.phoneCalls.delete(otherSideNumber.channelID);
                    }
                }
            } catch {
                if (!this.sosamba.guilds.has(otherSideNumber.guildID)) {
                    await ctx.send({
                        embeds: [{
                            title: ":x: Cannot call this number",
                            description: await t(ctx, "CALL_ABORTED_BOT_REMOVED"),
                            color: 0xFF0000,
                        }],
                    });
                    const phoneNumbers = await this.sosamba.db.getGuildPhoneNumbers(otherSideNumber.guildID);
                    await Promise.all(phoneNumbers.map(async ({ id }) => this.sosamba.db.deletePhoneNumber(id)));
                    return;
                } else {
                    await ctx.send({
                        embeds: [{
                            title: ":x: Cannot call this number",
                            description: await t(ctx, "CALL_ABORTED_NO_PERMISSIONS"),
                            color: 0xFF0000,
                        }],
                    });
                    return;
                }
            }
            break;
        }

        case "hangup": {
            if (!this.phoneCalls.has(ctx.channel.id)) {
                await ctx.send({
                    embeds: [{
                        title: ":x: You're not currently in a phone call",
                        description: "Try calling someone using /phone call!",
                        color: 0xFF0000,
                    }],
                    flags: 64,
                });

                return;
            }

            const phoneCallData = this.phoneCalls.get(ctx.channel.id);

            await Promise.all(
                [phoneCallData.caller.channelID, phoneCallData.otherSide.channelID]
                    .map(cID => this.sosamba.createMessage(cID, {
                        embeds: [{
                            title: ":wave: The call was hung up",
                            description: "Want to call the other side again? Use the /phone call command.",
                            color: 0xFF0000,
                        }],
                    })),
            );

            this.phoneCalls.delete(phoneCallData.caller.channelID);
            this.phoneCalls.delete(phoneCallData.otherSide.channelID);

            await ctx.send({
                embeds: [{
                    title: ":wave: The call was hung up",
                    description: "Want to call the other side again? Use the /phone call command.",
                    color: 0x008800,
                }],
                flags: 64,
            });

            break;
        }

        case "reply": {
            if (!this.phoneCalls.has(ctx.channel.id)) {
                await ctx.send({
                    embeds: [{
                        title: ":x: You're not currently in a phone call",
                        description: "Try calling someone using /phone call!",
                        color: 0xFF0000,
                    }],
                    flags: 64,
                });

                return;
            }

            const phoneCallData = this.phoneCalls.get(ctx.channel.id);

            const content = {
                embeds: [{
                    author: {
                        name: `${ctx.author.username}#${ctx.author.discriminator}`,
                        icon_url: ctx.author.avatarURL,
                    },
                    description: message,
                    footer: {
                        text: "This message is user-generated content.",
                    },
                }],
            };

            await this.sosamba.createMessage(phoneCallData.otherSide.channelID, content);
            await ctx.send(content);
        }
        }
    }

    async addChannelsToSpeakerPhone(phoneNumberInfo, otherSidePhoneNumberInfo) {
        const EMBED_BASE = {
            title: ":white_check_mark: Connected",
            color: 0x008800,
            footer: {
                text: "Use /phone reply to send a message over! Type /phone hangup to hang up.",
            },
        };

        const callerChannel = this.sosamba.getChannel(phoneNumberInfo.channelID);
        const otherSideChannel = this.sosamba.getChannel(otherSidePhoneNumberInfo.channelID);

        const callerString = `${phoneNumberInfo.id} ${!phoneNumberInfo.private ? `(#${callerChannel.name} at ${callerChannel.guild.name})` : ""}`;
        const otherSideCallerString = `${otherSidePhoneNumberInfo.id} ${!otherSidePhoneNumberInfo.private ? `(#${otherSideChannel.name} at ${otherSideChannel.guild.name})` : ""}`;


        this.phoneCalls.set(callerChannel.id, {
            caller: phoneNumberInfo,
            otherSide: otherSidePhoneNumberInfo,
        });

        this.phoneCalls.set(otherSideChannel.id, {
            caller: otherSidePhoneNumberInfo,
            otherSide: phoneNumberInfo,
        });

        await Promise.all([
            callerChannel.createMessage({
                embeds: [{
                    ...EMBED_BASE,
                    description: otherSideCallerString,
                    ...otherSidePhoneNumberInfo.private ? {} : {
                        thumbnail: {
                            url: otherSideChannel.guild.iconURL,
                        },
                    },
                }],
            }),
            otherSideChannel.createMessage({
                embeds: [{
                    ...EMBED_BASE,
                    description: callerString,
                    ...phoneNumberInfo.private ? {} : {
                        thumbnail: {
                            url: callerChannel.guild.iconURL,
                        },
                    },
                }],
            }),
        ]);
    }
}
 
export default PhoneCommand;
