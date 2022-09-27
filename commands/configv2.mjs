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


import { InteractionListener, Eris } from "sosamba";
import config from "../config.js";
import { getGuildConfig, setGuildConfig, t } from "../lib/util.mjs";
import Command from "../lib/commandTypes/AdminCommand.mjs";
import ConfigProps from "../lib/util/config/Properties.js";

const { webserver, prefix: defaultPrefix } = config;
const { Constants: { ChannelTypes, ComponentTypes, ButtonStyles, InteractionTypes, TextInputStyles } } = Eris;

// Snowflakes are uint64 
const MAX_SNOWFLAKE_LENGTH = (2n ** 64n - 1n).toString().length;

/**
 * An interaction listener that can handle configuration statelessly
 */
class ConfigInteractionListener extends InteractionListener {

    prerequisites(ctx) {
        if (![InteractionTypes.MESSAGE_COMPONENT, InteractionTypes.MODAL_SUBMIT].includes(ctx.interaction.type)) return;
        if (!ctx.interaction.data.custom_id.startsWith("tt.bot:config")) return;

        return true;
    }

    async run(ctx) {
        const { 2: action, 3: prop } = ctx.interaction.data.custom_id.split(":");

        switch (action) {
        case "optionSelect": {
            const { 0: prop } = ctx.interaction.data.values;

            // Invalid input :(
            if (!Object.prototype.hasOwnProperty.call(ConfigProps, prop)) {
                return;
            }

            const cfg = await getGuildConfig(ctx);

            await ctx.interaction.editParent(await this.getContentForProperty(ctx, prop, cfg));

            break;
        }

        case "home": {
            await ctx.interaction.editParent(await ConfigInteractionListener.DEFAULT_OBJ(ctx));

            break;
        }

        case "set": {
            // Invalid input :(
            if (!Object.prototype.hasOwnProperty.call(ConfigProps, prop)) {
                return;
            }

            const cfg = await getGuildConfig(ctx);

            const propInfo = ConfigProps[prop];

            await ctx.createModal({
                custom_id: `tt.bot:config:setModal:${prop}`,
                title: await t(ctx, propInfo.translationKey),
                components: [{
                    type: ComponentTypes.ACTION_ROW,
                    components: [{
                        type: ComponentTypes.INPUT_TEXT,
                        required: true,
                        custom_id: "newValue",
                        label: "New value",
                        value: cfg[prop],
                        ...propInfo.type === "string" ? {
                            style: TextInputStyles.PARAGRAPH,
                            max_length: 2000, // Maximum length of a message without Nitro
                        } : {
                            style: TextInputStyles.SHORT,
                            max_length: MAX_SNOWFLAKE_LENGTH,
                        },
                    }],
                }],
            });

            break;
        }

        case "setModal": {
            // Invalid input :(
            if (!Object.prototype.hasOwnProperty.call(ConfigProps, prop)) {
                return;
            }


            const newValue = ctx.interaction.data.components[0].components[0].value;
            console.debug(newValue);

            const propInfo = ConfigProps[prop];

            switch (propInfo.type) {
            case "channel": {
                if (!ctx.guild.channels.has(newValue)) {
                    await ctx.send({
                        content: "This is not a valid channel. Please try again with a valid channel ID.",
                        flags: 64,
                    });

                    return;
                }

                if (ctx.guild.channels.get(newValue).type !== ChannelTypes.GUILD_TEXT) {
                    await ctx.send({
                        content: "This channel is not a text channel. Please try again with a valid channel ID.",
                        flags: 64,
                    });

                    return;
                }


                break;
            }

            case "role": {
                if (!ctx.guild.roles.has(newValue)) {
                    await ctx.send({
                        content: "This is not a valid role. Please try again with a valid role ID.",
                        flags: 64,
                    });

                    return;
                }
                
                break;
            }

            case "string": {
                if (typeof propInfo.validation === "function"
                    && !await propInfo.validation(newValue, ctx)) {
                    await ctx.send({
                        content: "Invalid input received. Please try again with a valid value.",
                        flags: 64,
                    });

                    return;
                }

                break;
            }
            }

            await setGuildConfig(ctx, {
                [prop]: newValue,
            });

            await ctx.send({
                content: `Successfully set ${await t(ctx, propInfo.translationKey)} to ${this.getValueFromProperty(ctx, newValue, propInfo)}.`,
                flags: 64,
            });

            break;
        }

        case "reset": {
            // Invalid input :(
            if (!Object.prototype.hasOwnProperty.call(ConfigProps, prop)) {
                return;
            }

            const cfg = await getGuildConfig(ctx);

            const propInfo = ConfigProps[prop];
            const valueText = await this.getValueFromProperty(ctx, cfg[prop], propInfo);


            await ctx.interaction.editParent({
                embeds: [{
                    color: 0xffff00,
                    title: `❓ Are you sure you want to disable/reset ${await t(ctx, propInfo.translationKey)}?`,
                    description: await t(ctx, "SETTING_CURRENT_VAL", {
                        val: valueText,
                    }),
                }],
                components: [{
                    type: ComponentTypes.ACTION_ROW,
                    components: ctx.createYesNoButtons(),
                }],
            });

            const resp = await ctx.askYesNo(true);

            if (resp.response) {
                await setGuildConfig(ctx, {
                    [prop]: propInfo.default ? propInfo.default : null,
                });
            }

            if (resp.context) {
                await resp.context.interaction.editParent(
                    await this.getContentForProperty(ctx, prop, cfg),
                );
            } else {
                await ctx.interaction.editOriginalMessage(
                    await this.getContentForProperty(ctx, prop, cfg),
                );
            }

            break;
        }
        }
    }


    async getValueFromProperty(ctx, val, propData) {
        if (propData.type === "string") return val || await t(ctx, "NONE");
        else if (propData.type === "channel") {
            const chan = ctx.guild.channels.get(val);
            return chan ? chan.mention : await t(ctx, "NONE");
        } else if (propData.type === "role") {
            const role = ctx.guild.roles.get(val);
            return role ? role.mention : await t(ctx, "NONE");
        }
    }


    async getContentForProperty(ctx, prop, cfg) {

        const propInfo = ConfigProps[prop];
        const valueText = await this.getValueFromProperty(ctx, cfg[prop], propInfo);

        return {
            embeds: [{
                color: 0x008800,
                title: await t(ctx, propInfo.translationKey),
                description: await t(ctx, "SETTING_CURRENT_VAL", {
                    val: valueText,
                }),
                fields: [{
                    name: await t(ctx, "SETTING_SET"),
                    value: `${await t(ctx, "SETTING_SET_DESCRIPTION")}
                        ${propInfo.type !== "string" ? `*Because Discord does not support ${propInfo.type} selects yet, please, prepare your ${propInfo.type} ID beforehand. [Learn more about getting ${propInfo.type} IDs](https://support.discord.com/hc/en-us/articles/206346498)*` : ""}`,
                }, {
                    name: await t(ctx, propInfo.default ? "SETTING_RESET" : "SETTING_DISABLE"),
                    value: propInfo.default ? await t(ctx, "SETTING_RESET_DESCRIPTION", {
                        default: propInfo.default,
                    }) : await t(ctx, "SETTING_DISABLE_DESCRIPTION"),
                }, {
                    name: await t(ctx, "SETTING_HOME"),
                    value: await t(ctx, "SETTING_HOME_DESCRIPTION"),
                }],
            }],

            components: [{
                type: ComponentTypes.ACTION_ROW,
                components: [{
                    type: ComponentTypes.BUTTON,
                    custom_id: `tt.bot:config:set:${prop}`,
                    style: ButtonStyles.SECONDARY,
                    label: await t(ctx, "SETTING_SET"),
                    emoji: {
                        name: ConfigInteractionListener.SUB_MENU_ACTION_EDIT,
                    },
                },
                {
                    type: ComponentTypes.BUTTON,
                    custom_id: `tt.bot:config:reset:${prop}`,
                    style: ButtonStyles.SECONDARY,
                    label: await t(ctx, propInfo.default ? "SETTING_RESET" : "SETTING_DISABLE"),
                    emoji: {
                        name: ConfigInteractionListener.DISABLE,
                    },
                },
                {
                    type: ComponentTypes.BUTTON,
                    custom_id: "tt.bot:config:home",
                    style: ButtonStyles.SECONDARY,
                    label: await t(ctx, "SETTING_HOME"),
                    emoji: {
                        name: ConfigInteractionListener.HOME,
                    },
                }],
            }],
        };
    }

    /**
     * 
     * @param {import("sosamba").InteractionContext} ctx 
     * @returns 
     */
    static async DEFAULT_OBJ(ctx) {
        return {
            embeds: [{
                description: await t(ctx, "WELCOME_TO_CONFIG", {
                    webInterfaceURL: webserver.display("/"),
                }),
                color: 0x008800,
                fields: await Promise.all(Object.values(ConfigProps).map(async n => ({
                    name: await t(ctx, n.translationKey),
                    value: await t(ctx, n.descriptionTranslationKey, {
                        defaultPrefix: defaultPrefix,
                    }),
                }))),
            }],
            components: [{
                type: ComponentTypes.ACTION_ROW,
                components: [
                    {
                        type: ComponentTypes.STRING_SELECT,
                        custom_id: "tt.bot:config:optionSelect",
                        options: await Promise.all(Object.entries(ConfigProps).map(async ([k, n]) => ({
                            label: await t(ctx, n.translationKey),
                            value: k,
                            emoji: {
                                name: this.EmojiPropMap[k] ?? "❓",
                            },
                        }))),
                        placeholder: "Choose an option to modify…",
                    },
                ],
            }],
            flags: 64,
        };
    }

    
    static PREFIX = "🖋";

    static MODROLE = "🔨";

    static FAREWELL = "👋";

    static FAREWELLCHANNEL = "🖊";

    static GREETING = "🤝";

    static GREETINGCHANNEL = "✏";

    static AGREE = "✅";

    static MEMBER = "👥";

    static LOGCHANNEL = "🗒";

    static LOGEVENTS = "📝";

    static SUB_MENU_ACTION_EDIT = "📝";

    static MODLOG = "🛠";

    static LOCALE = "🗣️";

    static HOME = "🏠";

    static DISABLE = "❌";

    static EmojiPropMap = {
        prefix: this.PREFIX,
        modRole: this.MODROLE,
        farewellMessage: this.FAREWELL,
        farewellChannelId: this.FAREWELLCHANNEL,
        greetingMessage: this.GREETING,
        greetingChannelId: this.GREETINGCHANNEL,
        agreeChannel: this.AGREE,
        memberRole: this.MEMBER,
        logChannel: this.LOGCHANNEL,
        logEvents: this.LOGEVENTS,
        modlogChannel: this.MODLOG,
        locale: this.LOCALE,
    };
}

class ConfigCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: "configv2",
            description: "Lets you manage what I know about your server.",
            guildOnly: true,
        });

        this.interactionListener = this.sosamba.interactionListeners.add(new ConfigInteractionListener(this.sosamba));
    }

    async run(ctx) {
        if (!await getGuildConfig(ctx)) {
            await this.sosamba.db.createGuildConfig(ctx._guildConfig = {
                id: ctx.guild.id,
            });
        }

        await ctx.send(await ConfigInteractionListener.DEFAULT_OBJ(ctx));
    }

    unmount() {
        this.sosamba.interactionListeners.remove(this.interactionListener);
    }
}

export default ConfigCommand;
