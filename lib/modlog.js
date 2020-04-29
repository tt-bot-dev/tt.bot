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
const message = require("./modlog/messagetemplate");
const { PunishTypes } = require("./modlog/constants");
const uuidregex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const { v4: createUUID } = require("uuid");

class ModLog {
    constructor(bot) {
        this.bot = bot;
    }
    async makeLogMessage(userID, key, type, msg, reason, obj) {
        const user = await this.bot.getUserWithoutRESTMode(userID); // just if someone decided to leave the guild while getting the data
        const { modlogChannel } = await msg.guildConfig;
        if (!msg.guild.channels.has(modlogChannel)) return;
        return await this.bot.createMessage(modlogChannel, {
            content: key,
            embed: message(type, key, user, msg.author, reason, obj, this.bot)
        });
    }

    async getUserStrikes(userID, ctx) {
        const guildID = ctx.guild.id;
        let guildStrikes = await ctx.db.getGuildModlog(guildID);
        if (!guildStrikes) guildStrikes = await ctx.db.insertNewModlog(guildID);
        const { items } = guildStrikes;
        return items.filter(s => s.type === PunishTypes.STRIKE && s.userID === userID);
    }

    async generateObj(userID, reason, type) {
        return {
            id: createUUID(),
            userID, reason, type,
            messageID: null
        };
    }

    async addStrikeExtension(userID, guild, reason) {
        const guildID = guild.id;
        const config = this.bot.db.getGuildConfig(guild.id);
        if (!config) return;
        if (!guild.channels.get(config.modlogChannel)) return;
        if (await this.bot.isModerator(guild.members.get(userID), false)) throw new Error();
        let guildStrikes = await this.bot.db.getGuildModlog(guildID);
        if (!guildStrikes) guildStrikes = await this.bot.db.insertNewModlog(guildID);
        const { items } = guildStrikes;
        const dataobj = await this.generateObj(userID, reason, PunishTypes.STRIKE);
        const m = await this.makeLogMessage(userID, dataobj.id, PunishTypes.STRIKE, { guild, guildConfig: config, author: this.bot.user }, reason);
        if (!m) throw "Cannot make modlog message";
        dataobj.messageID = m.id;
        items.push(dataobj);
        await this.bot.db.updateModlog(guildID, { items });
    }

    async addStrike(userID, msg, reason) {
        if (!msg.guild.channels.get((await msg.guildConfig).modlogChannel)) return;
        if (await this.bot.isModerator(msg.guild.members.get(userID), false)) throw msg.t("MODS_UNSTRIKABLE");
        const guildID = msg.guild.id;
        let guildStrikes = await this.bot.db.getGuildModlog(guildID);
        if (!guildStrikes) guildStrikes = await this.bot.db.insertNewModlog(guildID);
        const { items } = guildStrikes;
        const dataobj = await this.generateObj(userID, reason, PunishTypes.STRIKE);
        const m = await this.makeLogMessage(userID, dataobj.id, PunishTypes.STRIKE, msg, reason);
        if (!m) throw "Cannot make modlog message";
        dataobj.messageID = m.id;
        items.push(dataobj);
        await this.bot.db.updateModlog(guildID, { items });
    }

    async addBan(userID, msg, reason, isSoft) {
        if (!msg.guild.channels.get((await msg.guildConfig).modlogChannel)) return;
        const t = isSoft ? PunishTypes.SOFTBAN : PunishTypes.BAN;
        const guildID = msg.guild.id;
        let guildStrikes = await this.bot.db.getGuildModlog(guildID);
        if (!guildStrikes) guildStrikes = await this.bot.db.insertNewModlog(guildID);
        const { items } = guildStrikes;
        const dataobj = await this.generateObj(userID, reason, t);
        const m = await this.makeLogMessage(userID, dataobj.id, t, msg, reason);
        dataobj.messageID = m.id;
        items.push(dataobj);
        await this.bot.db.updateModlog(guildID, { items });
    }

    async addKick(userID, msg, reason) {
        if (!msg.guild.channels.get((await msg.guildConfig).modlogChannel)) return;
        const guildID = msg.guild.id;
        let guildStrikes = await this.bot.db.getGuildModlog(guildID);
        if (!guildStrikes) guildStrikes = await this.bot.db.insertNewModlog(guildID);
        const { items } = guildStrikes;
        const dataobj = await this.generateObj(userID, reason, PunishTypes.KICK);
        const m = await this.makeLogMessage(userID, dataobj.id, PunishTypes.KICK, msg, reason);
        dataobj.messageID = m.id;
        items.push(dataobj);
        await this.bot.db.updateModlog(guildID, { items });
    }

    async removeStrike(strikeID, msg, reason) {
        if (!msg.guild.channels.get((await msg.guildConfig).modlogChannel)) return;
        if (!uuidregex.test(strikeID)) throw "Invalid case ID";
        const guildID = msg.guild.id;
        let guildStrikes = await this.bot.db.getGuildModlog(guildID);
        if (!guildStrikes) guildStrikes = await this.bot.db.insertNewModlog(guildID);
        const { items } = guildStrikes;
        const dataobj = items.find(k => k.id === strikeID && k.type === PunishTypes.STRIKE);
        const dataobjIndex = items.indexOf(dataobj); // store the index for replacement
        if (!dataobj) throw "Strike not found";
        dataobj.type = PunishTypes.REMOVED_STRIKE;
        items[dataobjIndex] = dataobj;
        const newDataobj = await this.generateObj(dataobj.userID, reason, PunishTypes.STRIKE_REMOVE);
        items.push(newDataobj);
        const m = await this.makeLogMessage(dataobj.userID, newDataobj.id, PunishTypes.STRIKE_REMOVE, msg, reason, dataobj);
        newDataobj.messageID = m.id;
        await this.bot.db.updateModlog(guildID, { items });
    }

    async updateReason(itemID, msg, newReason) {
        if (!uuidregex.test(itemID)) throw "Invalid case ID";
        const guildID = msg.guild.id;

        let guildStrikes = await this.bot.db.getGuildModlog(guildID);
        if (!guildStrikes) guildStrikes = await this.bot.db.insertNewModlog(guildID);
        const { items } = guildStrikes;
        const dataobj = items.find(k => k.id === itemID);

        if (!dataobj) throw "Item not found";
        dataobj.reason = newReason;
        if (!dataobj.userID) dataobj.userID = msg.author.id;
        await this.updateMessage(dataobj.messageID, dataobj, msg);
        await this.bot.db.updateModlog(guildID, { items });
    }

    async updateMessage(messageID, obj, msg) {
        const c = msg.guild.channels.get((await msg.guildConfig).modlogChannel);
        if (!c) return;
        const m = await c.getMessage(messageID);
        const u = this.bot.users.get(obj.userID) || await this.bot.getUserWithoutRESTMode(obj.userID);
        const e = message(obj.type, obj.id, u, msg.author, obj.reason, null, this.bot);
        await m.edit({ embed: e });
    }
}
module.exports = ModLog;
