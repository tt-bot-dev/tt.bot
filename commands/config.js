/**
 * Copyright (C) 2020 tt.bot dev team
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

"use strict";
const { ReactionMenu } = require("sosamba");
const { role, channel } = require("sosamba/lib/argParsers/switchSerializers/erisObjects");
const { prefix: defaultPrefix } = require("../config");
const Command = require("../lib/commandTypes/AdminCommand");
const ConfigProps = require("../lib/util/config/Properties");

class ConfigMenu extends ReactionMenu {
    constructor(...args) {
        super(...args);
        delete this.callbacks;
        this.timeout = 5 * 6e4;
        this.state = ConfigMenu.States.MAIN_MENU;
        this.reactionErrored = false;
    }

    get callbacks() {
        const o = {};
        if (this.state === ConfigMenu.States.MAIN_MENU) {
            for (const EmojiProp in ConfigMenu.EmojiPropMap) {
                if (!Object.prototype.hasOwnProperty
                    .call(ConfigMenu.EmojiPropMap, EmojiProp)) continue;
                o[EmojiProp] = () =>
                    this.showSubMenu(ConfigMenu.EmojiPropMap[EmojiProp]);
            }
        } else if (this.state === ConfigMenu.States.SUB_MENU) {
            o[ConfigMenu.HOME] = () => this.goHome();
            o[ConfigMenu.SUB_MENU_ACTION_EDIT] = () => this.setProperty();
            o[ConfigMenu.DISABLE] = () => this.resetProperty();
        }

        return o;
    }

    set callbacks(_) { }

    async showSubMenu(prop, transitionFromQuestion = false) {
        this.state = ConfigMenu.States.UNAVAILABLE;
        const propInfo = ConfigProps[prop];
        this.currentlyEditing = { prop, propInfo };
        const valueText = await this.getValueFromProperty(
            (await this.ctx.guildConfig)[prop], propInfo
        );
        if (!transitionFromQuestion) await this.cleanReactions();
        await this.ctx.send({
            embed: {
                color: 0x008800,
                title: await this.ctx.t(propInfo.translationKey),
                description: await this.ctx.t("SETTING_CURRENT_VAL", valueText),
                fields: [{
                    name: await this.ctx.t("SETTING_SET"),
                    value: await this.ctx.t("SETTING_SET_DESCRIPTION")
                }, {
                    name: await this.ctx.t(propInfo.default ? "SETTING_RESET" : "SETTING_DISABLE"),
                    value: propInfo.default ? await this.ctx.t("SETTING_RESET_DESCRIPTION", propInfo.default) : await this.ctx.t("SETTING_DISABLE_DESCRIPTION")
                }, {
                    name: await this.ctx.t("SETTING_HOME"),
                    value: await this.ctx.t("SETTING_HOME_DESCRIPTION")
                }]
            }
        });
        this.state = ConfigMenu.States.SUB_MENU;
        await this.prepareEmoji();
    }

    async setProperty() {
        this.state = ConfigMenu.States.QUESTION;
        let translationKey = "", timeout = 0, toSave;
        const { prop, propInfo } = this.currentlyEditing;
        if (propInfo.type === "string") {
            translationKey = "QUESTION_STRING_VAL";
            timeout = 60000;
        } else if (propInfo.type === "role") {
            translationKey = "QUESTION_ROLE_VAL";
            timeout = 30000;
        } else if (propInfo.type === "channel") {
            translationKey = "QUESTION_CHANNEL_VAL";
            timeout = 30000;
        }
        const m = await this.ctx.channel.createMessage(await this.ctx.t(translationKey));
        try {
            const resp = await this.ctx.waitForMessage(undefined, timeout);
            if (propInfo.type === "string") toSave = resp.msg.content;
            else if (propInfo.type === "role") toSave = (await role(resp.msg.content, this.ctx, {
                name: "the role input"
            })).id;
            else if (propInfo.type === "channel") toSave = (await channel(resp.msg.content, this.ctx, {
                textOnly: true
            })).id;
            if (typeof propInfo.validation === "function"
                && await propInfo.validation(toSave, this.ctx) === false) throw new Error();
        } catch (err) {
            console.error(err);
            await m.edit(await this.ctx.t("OP_CANCELLED"));
            await this.showSubMenu(prop, true);
            return;
        }
        await (this.ctx.guildConfig = { [prop]: toSave });
        await m.delete();
        await this.showSubMenu(prop, true);
    }

    async resetProperty() {
        this.state = ConfigMenu.States.QUESTION;
        const { prop, propInfo } = this.currentlyEditing;
        const m = await this.ctx.channel.createMessage(
            await this.ctx.t(propInfo.default ? "QUESTION_RESET" : "QUESTION_DISABLE",
                await this.ctx.t(ConfigProps[prop].translationKey))
        );
        const resp = await this.ctx.askYesNo();
        if (resp) {
            await (this.ctx.guildConfig = { [prop]: propInfo.default ? propInfo.default : null });
            await m.delete();
        } else {
            await m.edit(await this.ctx.t("OP_CANCELLED"));
            setTimeout(() => m.delete().then(null, () => ""), 5000);
        }
        this.state = ConfigMenu.States.SUB_MENU;
        await this.showSubMenu(prop, true);
    }

    async goHome() {
        this.state = ConfigMenu.States.UNAVAILABLE;
        this.currentlyEditing = null;
        await this.cleanReactions();
        await this.ctx.send(await ConfigMenu.DEFAULT_OBJ(this.ctx));
        this.state = ConfigMenu.States.MAIN_MENU;
        await this.prepareEmoji();
    }

    async cleanReactions() {
        if (this.sosamba.hasBotPermission(this.ctx.channel, "manageMessages")) {
            try {
                await this.message.removeReactions(); 
            } catch {}
        } else {
            if (!this.reactionErrored) {
                this.reactionErrored = true;
                await this.ctx.channel.createMessage(
                    await this.ctx.t("REACTION_MENU_NO_AUTOREMOVE")
                );
            }
        }
    }

    async getValueFromProperty(val, propData) {
        if (propData.type === "string") return val || await this.ctx.t("NONE");
        else if (propData.type === "channel") {
            const chan = this.ctx.guild.channels.get(val);
            return `#${chan ? chan.name : await this.ctx.t("NONE")}`;
        } else if (propData.type === "role") {
            const role = this.ctx.guild.roles.get(val);
            return role ? role.mention : await this.ctx.t("NONE");
        }
    }
    static async DEFAULT_OBJ(ctx) {
        return {
            embed: {
                description: await ctx.t("WELCOME_TO_CONFIG"),
                color: 0x008800,
                fields: await Promise.all(Object.values(ConfigProps).map(async n => ({
                    name: await ctx.t(n.translationKey),
                    value: await ctx.t(n.descriptionTranslationKey)
                })))
            }
        };
    }
}

ConfigMenu.PREFIX = "🖋";
ConfigMenu.MODROLE = "🔨";
ConfigMenu.FAREWELL = "👋";
ConfigMenu.FAREWELLCHANNEL = "🖊";
ConfigMenu.GREETING = "🤝";
ConfigMenu.GREETINGCHANNEL = "✏";
ConfigMenu.AGREE = "✅";
ConfigMenu.MEMBER = "👥";
ConfigMenu.LOGCHANNEL = "🗒";
ConfigMenu.LOGEVENTS = ConfigMenu.SUB_MENU_ACTION_EDIT = "📝";
ConfigMenu.MODLOG = "🛠";
ConfigMenu.LOCALE = "🗣️";
ConfigMenu.States = {
    MAIN_MENU: 0,
    SUB_MENU: 1,
    QUESTION: 2,
    UNAVAILABLE: 3
};
ConfigMenu.EmojiPropMap = {
    [ConfigMenu.PREFIX]: "prefix",
    [ConfigMenu.MODROLE]: "modRole",
    [ConfigMenu.FAREWELL]: "farewellMessage",
    [ConfigMenu.FAREWELLCHANNEL]: "farewellChannelId",
    [ConfigMenu.GREETING]: "greetingMessage",
    [ConfigMenu.GREETINGCHANNEL]: "greetingChannelId",
    [ConfigMenu.AGREE]: "agreeChannel",
    [ConfigMenu.MEMBER]: "memberRole",
    [ConfigMenu.LOGCHANNEL]: "logChannel",
    [ConfigMenu.LOGEVENTS]: "logEvents",
    [ConfigMenu.MODLOG]: "modlogChannel",
    [ConfigMenu.LOCALE]: "locale"
};
ConfigMenu.HOME = "🏠";
ConfigMenu.DISABLE = "❌";

class ConfigCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: "config",
            description: "Lets you manage what I know about your server."
        });
    }

    async run(ctx) {
        if (!await ctx.guildConfig) {
            await ctx.db.createGuildConfig(ctx._guildConfig = {
                id: ctx.guild.id,
                prefix: defaultPrefix
            });
        }

        const m = await ctx.send(await ConfigMenu.DEFAULT_OBJ(ctx));
        ctx.registerReactionMenu(new ConfigMenu(ctx, m));
    }
}

module.exports = ConfigCommand;