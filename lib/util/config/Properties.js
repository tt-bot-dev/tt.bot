/**
 * Copyright (C) 2021 tt.bot dev team
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
const { prefix } = require("../../../config");
const Prop = {
    prefix: {
        type: "string",
        default: prefix,
        translationKey: "CONFIG_PREFIX",
        descriptionTranslationKey: "CONFIG_PREFIX_DESCRIPTION"
    },
    modRole: {
        type: "role",
        translationKey: "CONFIG_MODROLE",
        descriptionTranslationKey: "CONFIG_MODROLE_DESCRIPTION"
    },
    farewellMessage: {
        type: "string",
        translationKey: "CONFIG_FAREWELL",
        descriptionTranslationKey: "CONFIG_FAREWELL_DESCRIPTION"
    },
    farewellChannelId: {
        type: "channel",
        translationKey: "CONFIG_FAREWELL_CHANNEL",
        descriptionTranslationKey: "CONFIG_FAREWELL_CHANNEL_DESCRIPTION"
    },
    greetingMessage: {
        type: "string",
        translationKey: "CONFIG_GREETING",
        descriptionTranslationKey: "CONFIG_GREETING_DESCRIPTION"
    },
    greetingChannelId: {
        type: "channel",
        translationKey: "CONFIG_GREETING_CHANNEL",
        descriptionTranslationKey: "CONFIG_GREETING_CHANNEL_DESCRIPTION"
    },
    agreeChannel: {
        type: "channel",
        translationKey: "CONFIG_AGREE_CHANNEL",
        descriptionTranslationKey: "CONFIG_AGREE_CHANNEL_DESCRIPTION"
    },
    memberRole: {
        type: "role",
        translationKey: "CONFIG_MEMBER_ROLE",
        descriptionTranslationKey: "CONFIG_MEMBER_ROLE_DESCRIPTION"
    },
    logChannel: {
        type: "channel",
        translationKey: "CONFIG_LOG_CHANNEL",
        descriptionTranslationKey: "CONFIG_LOG_CHANNEL_DESCRIPTION"
    },
    logEvents: {
        type: "string",
        translationKey: "CONFIG_LOG_EVENTS",
        descriptionTranslationKey: "CONFIG_LOG_EVENTS_DESCRIPTION"
    },
    modlogChannel: {
        type: "channel",
        translationKey: "CONFIG_MODLOG_CHANNEL",
        descriptionTranslationKey: "CONFIG_MODLOG_CHANNEL_DESCRIPTION"
    },
    locale: {
        type: "string",
        translationKey: "CONFIG_LOCALE",
        descriptionTranslationKey: "CONFIG_LOCALE_DESCRIPTION",
        validation: (val, ctx) => Object.prototype.hasOwnProperty
            .call(ctx.sosamba.i18n.languages, val)
    }
};

module.exports = Prop;