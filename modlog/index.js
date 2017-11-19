const message = require("./messagetemplate")
const {PunishTypes} = require("./constants")
class ModLog {
    constructor() {
    }
    async makeLogMessage(userID, key, type, msg, reason) {
        const user = await bot.getUserWithoutRESTMode(userID) // just if a cunt decided to leave the guild while getting the data
        if (!msg.guild.channels.get(msg.guildConfig.modlogChannel)) return;
        return await bot.createMessage(msg.guildConfig.modlogChannel, {embed: message(type, key, user, msg.author, reason)})
    }
    async addStrike(userID, msg, reason) {
        const guildID = msg.guild.id
        let guildStrikes = await db.table("modlog").get(guildID)
        if (!guildStrikes) {
            await db.table("modlog").insert({
                id: guildID,
                items: []
            })
            guildStrikes = await db.table("modlog").get(guildID)
        }
        let {items} = guildStrikes;
        const dataobj = {
            id: (await db.uuid()),
            userID,
            reason,
            type: PunishTypes.STRIKE,
            messageID: null
        }

        const m = await this.makeLogMessage(userID, dataobj.id, PunishTypes.STRIKE, msg, reason)
        dataobj.messageID = m.id
        items.push(dataobj);
        await db.table("modlog").get(guildID).update({items})
    }
    
    async addBan(userID, msg, reason, isSoft) {
        const t = isSoft? PunishTypes.SOFTBAN : PunishTypes.BAN
        const guildID = msg.guild.id
        let guildStrikes = await db.table("modlog").get(guildID)
        if (!guildStrikes) {
            await db.table("modlog").insert({
                id: guildID,
                items: []
            })
            guildStrikes = await db.table("modlog").get(guildID)
        }
        let {items} = guildStrikes;
        const dataobj = {
            id: (await db.uuid()),
            userID,
            reason,
            type:t,
            messageID: null
        }
        const m = await this.makeLogMessage(userID, dataobj.id, t, msg, reason)
        dataobj.messageID = m.id
        items.push(dataobj);
        await db.table("modlog").get(guildID).update({items})
    }

    async addKick(userID, msg, reason) {
        const guildID = msg.guild.id
        let guildStrikes = await db.table("modlog").get(guildID)
        if (!guildStrikes) {
            await db.table("modlog").insert({
                id: guildID,
                items: []
            })
            guildStrikes = await db.table("modlog").get(guildID)
        }
        let {items} = guildStrikes;
        const dataobj = {
            id: (await db.uuid()),
            userID,
            reason,
            type: PunishTypes.KICK,
            messageID: null
        }
        const m = await this.makeLogMessage(userID, dataobj.id, PunishTypes.KICK, msg, reason)
        dataobj.messageID = m.id
        items.push(dataobj);
        await db.table("modlog").get(guildID).update({items})
    }

    async removeStrike(strikeID, msg, reason) {
        const guildID = msg.guild.id
        let guildStrikes = await db.table("modlog").get(guildID)
        if (!guildStrikes) {
            await db.table("modlog").insert({
                id: guildID,
                items: []
            })
            guildStrikes = await db.table("modlog").get(guildID)
        }
        let {items} = guildStrikes;
        const dataobj = items.find(k => k.id == strikeID && k.type == PunishTypes.STRIKE);
        const dataobjIndex = items.indexOf(dataobj) // store the index for replacement
        if (!dataobj) throw "Strike not found"
        dataobj.type = PunishTypes.REMOVED_STRIKE
        items[dataobjIndex] = dataobj
        const newDataobj = {
            id: (await db.uuid()),
            userID: dataobj.userID,
            reason,
            type: PunishTypes.STRIKE_REMOVE,
            messageID: null
        }
        items.push(newDataobj)
        const m = await this.makeLogMessage(dataobj.userID, newDataobj.id, PunishTypes.STRIKE_REMOVE, msg, reason)
        newDataobj.messageID = m.id
        await db.table("modlog").get(guildID).update({items})
    }

    async updateReason(itemID, msg, newReason) {
        const guildID = msg.guild.id
        let guildStrikes = await db.table("modlog").get(guildID)
        if (!guildStrikes) {
            await db.table("modlog").insert({
                id: guildID,
                items: []
            })
            guildStrikes = await db.table("modlog").get(guildID)
        }
        let {items} = guildStrikes;
        const dataobj = items.find(k => k.id == itemID);
        const dataobjIndex = items.indexOf(dataobj) // store the index for replacement
        if (!dataobj) throw "Item not found"
        dataobj.reason = newReason;
        await this.updateMessage(dataobj.messageID, dataobj, msg)
        await db.table("modlog").get(guildID).update({items})
    }

    async updateMessage(messageID, obj, msg) {
        if (!msg.guild.channels.get(msg.guildConfig.modlogChannel)) return;
        const m = await msg.guild.channels.get(msg.guildConfig.modlogChannel).getMessage(messageID)
        //const [embed] = m.embeds
        //embed.fields[0].value = obj.reason
        const e = message(obj.type, obj.id, obj.userID, msg.author, obj.reason)
        await m.edit({embed: e})
    }
    fuckingNukeThis(){return Promise.reject("no")} //please we are missing some humor
}
module.exports = ModLog