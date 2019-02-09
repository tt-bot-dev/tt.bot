const message = require("./modlog/messagetemplate");
const {PunishTypes} = require("./modlog/constants");
const uuidregex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
class ModLog {
    constructor() {
    }
    async makeLogMessage(userID, key, type, msg, reason, obj) {
        const user = await bot.getUserWithoutRESTMode(userID); // just if a cunt decided to leave the guild while getting the data
        if (!msg.guild.channels.get(msg.guildConfig.modlogChannel)) return;
        return await bot.createMessage(msg.guildConfig.modlogChannel, {content:key, embed: message(type, key, user, msg.author, reason, obj)});
    }

    async getUserStrikes(userID, msg) {
        const guildID = msg.guild.id;
        let guildStrikes = await db.table("modlog").get(guildID);
        if (!guildStrikes) guildStrikes = await this.insertNew(guildID);
        let {items} = guildStrikes;
        return items.filter(s => s.type === PunishTypes.STRIKE && s.userID === userID);
    }

    async insertNew(guildID) {
        await db.table("modlog").insert({
            id: guildID,
            items: []
        });
        return await db.table("modlog").get(guildID);
    }

    async generateObj(userID, reason, type) {
        return {
            id: (await db.uuid()),
            userID, reason, type,
            messageID: null
        };
    }

    async addStrikeExtension(userID, guild, reason) {
        const guildID = guild.id;
        const config = await db.table("configs").get(guild.id);
        if (!config) return;
        if (!guild.channels.get(config.modlogChannel)) return;
        if ((await bot.isModerator(guild.members.get(userID), false))) throw new Error();
        let guildStrikes = await db.table("modlog").get(guildID);
        if (!guildStrikes) guildStrikes = await this.insertNew(guildID);
        let {items} = guildStrikes;
        const dataobj = await this.generateObj(userID, reason, PunishTypes.STRIKE);
        const m = await this.makeLogMessage(userID, dataobj.id, PunishTypes.STRIKE, {guild, guildConfig: config, author: bot.user}, reason);
        if (!m) throw "Cannot make modlog message";
        dataobj.messageID = m.id;
        items.push(dataobj);
        await db.table("modlog").get(guildID).update({items});
    }
    async addStrike(userID, msg, reason) {
        if (!msg.guild.channels.get(msg.guildConfig.modlogChannel)) return;
        if ((await bot.isModerator(msg.guild.members.get(userID), false))) throw msg.t("MODS_UNSTRIKABLE");
        const guildID = msg.guild.id;
        let guildStrikes = await db.table("modlog").get(guildID);
        if (!guildStrikes) guildStrikes = await this.insertNew(guildID);
        let {items} = guildStrikes;
        const dataobj = await this.generateObj(userID, reason, PunishTypes.STRIKE);
        const m = await this.makeLogMessage(userID, dataobj.id, PunishTypes.STRIKE, msg, reason);
        if (!m) throw "Cannot make modlog message";
        dataobj.messageID = m.id;
        items.push(dataobj);
        await db.table("modlog").get(guildID).update({items});
    }
    
    async addBan(userID, msg, reason, isSoft) {
        if (!msg.guild.channels.get(msg.guildConfig.modlogChannel)) return;
        const t = isSoft? PunishTypes.SOFTBAN : PunishTypes.BAN;
        const guildID = msg.guild.id;
        let guildStrikes = await db.table("modlog").get(guildID);
        if (!guildStrikes) guildStrikes = await this.insertNew(guildID);
        let {items} = guildStrikes;
        const dataobj = await this.generateObj(userID, reason, t);
        const m = await this.makeLogMessage(userID, dataobj.id, t, msg, reason);
        dataobj.messageID = m.id;
        items.push(dataobj);
        await db.table("modlog").get(guildID).update({items});
    }

    async addKick(userID, msg, reason) {
        if (!msg.guild.channels.get(msg.guildConfig.modlogChannel)) return;
        const guildID = msg.guild.id;
        let guildStrikes = await db.table("modlog").get(guildID);
        if (!guildStrikes) guildStrikes = await this.insertNew(guildID);
        let {items} = guildStrikes;
        const dataobj = await this.generateObj(userID, reason, PunishTypes.KICK);
        const m = await this.makeLogMessage(userID, dataobj.id, PunishTypes.KICK, msg, reason);
        dataobj.messageID = m.id;
        items.push(dataobj);
        await db.table("modlog").get(guildID).update({items});
    }

    async removeStrike(strikeID, msg, reason) {
        if (!msg.guild.channels.get(msg.guildConfig.modlogChannel)) return;
        if (!uuidregex.test(strikeID)) throw "Invalid case ID";
        const guildID = msg.guild.id;
        let guildStrikes = await db.table("modlog").get(guildID);
        if (!guildStrikes) guildStrikes = await this.insertNew(guildID);
        let {items} = guildStrikes;
        const dataobj = items.find(k => k.id == strikeID && k.type == PunishTypes.STRIKE);
        const dataobjIndex = items.indexOf(dataobj); // store the index for replacement
        if (!dataobj) throw "Strike not found";
        dataobj.type = PunishTypes.REMOVED_STRIKE;
        items[dataobjIndex] = dataobj;
        const newDataobj = await this.generateObj(dataobj.userID, reason, PunishTypes.STRIKE_REMOVE);
        items.push(newDataobj);
        const m = await this.makeLogMessage(dataobj.userID, newDataobj.id, PunishTypes.STRIKE_REMOVE, msg, reason, dataobj);
        newDataobj.messageID = m.id;
        await db.table("modlog").get(guildID).update({items});
    }

    async updateReason(itemID, msg, newReason) {
        if (!uuidregex.test(itemID)) throw "Invalid case ID";
        const guildID = msg.guild.id;
        let guildStrikes = await db.table("modlog").get(guildID);
        if (!guildStrikes) {
            await db.table("modlog").insert({
                id: guildID,
                items: []
            });
            guildStrikes = await db.table("modlog").get(guildID);
        }
        let {items} = guildStrikes;
        const dataobj = items.find(k => k.id == itemID);

        if (!dataobj) throw "Item not found";
        dataobj.reason = newReason;
        if (!dataobj.userID) dataobj.userID = msg.author.id;
        await this.updateMessage(dataobj.messageID, dataobj, msg);
        await db.table("modlog").get(guildID).update({items});
    }

    async updateMessage(messageID, obj, msg) {
        if (!msg.guild.channels.get(msg.guildConfig.modlogChannel)) return;
        const m = await msg.guild.channels.get(msg.guildConfig.modlogChannel).getMessage(messageID);
        const u = await bot.getUserWithoutRESTMode(obj.userID);
        const e = message(obj.type, obj.id, u, msg.author, obj.reason);
        await m.edit({embed: e});
    }
    fuckingNukeThis(){return Promise.reject("no");} //please we are missing some humor
}
module.exports = ModLog;