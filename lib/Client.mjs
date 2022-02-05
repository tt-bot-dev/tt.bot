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

import { Client, Eris } from "sosamba";
import { request } from "undici";
import ErisEndpoints from "eris/lib/rest/Endpoints.js";
import ModLog from "./modlog.mjs";
import WorkerManager from "./util/worker.mjs";
import resolveInvite from "./util/resolveInvite.mjs";
import OwnerCommand from "./commandTypes/OwnerCommand.mjs";
import DBProvider from "./DBProvider.js";
import dataEncryption from "./dataEncryption.js";

const { Base, User } = Eris;

class TTBotClient extends Client {
    modLog = new ModLog(this);
    workers = new WorkerManager();
    readyTime = 0;
    dataEncryption = dataEncryption;

    constructor(token, options, db) {
        super(token, options);
        const dbClass = db.provider(this);
        if (!(dbClass.prototype instanceof DBProvider))
            throw new Error("The database provider must inherit from the DBProvider class");
        this.db = new dbClass(db.options);
    }

    async postStatsTo(key = "", url = "", pld = { server_count: this.guilds.size }) {
        if (!key || !url || !pld) return;
        const data = await request(url, {
            headers: {
                authorization: key
            },
            body: JSON.stringify(pld),
            method: "POST",
        });

        if (data.statusCode !== 200)
            throw new Error(`${data.statusCode}\n${JSON.stringify(await data.body.json(), null, 4)}`);
        return;
    }
    passesRoleHierarchy(invoker, member) {
        if (!invoker) return false;
        if (!member) return true;
        if (invoker.guild.id !== member.guild.id) throw new TypeError("Members aren't in the same guild");
        if (invoker.guild.ownerID === invoker.id) return true;
        if (invoker.guild.ownerID === member.id) return false;
        if (invoker.roles.length === 0) return false;
        if (member.roles.length === 0) return true;
        const member1HighestRole = invoker.roles.reduce((a, b) => {
            const secondRole = invoker.guild.roles.get(b);
            return a.position >= secondRole.position ? a : secondRole;
        }, invoker.guild.roles.get(invoker.guild.id));
        const member2HighestRole = member.roles.reduce((a, b) => {
            const secondRole = member.guild.roles.get(b);
            return a.position >= secondRole.position ? a : secondRole;
        }, member.guild.roles.get(member.guild.id));
        return member1HighestRole.position > member2HighestRole.position;
    }
    async isModerator(member, botOwnerIsMod = true) {
        if (this.isAdmin(member, botOwnerIsMod)) return true;
        const server = await this.db.getGuildConfig(member.guild.id);
        const defaultModRole = member.guild.roles
            .find(r => r.name.toLowerCase() === "tt.bot mod");
        return member.roles.includes(server?.modRole || defaultModRole?.id);
    }

    isAdmin(member, botOwnerIsAdmin = true) {
        if (botOwnerIsAdmin && OwnerCommand.prototype.permissionCheck.call(null, {
            author: member.user
        })) return true;
        if (member.permissions.has("manageGuild")) return true;
        if (member.guild.ownerID === member.id) return true;
    }

    get botCollectionServers() {
        return this.guilds.filter(g => g.members.filter(member => member.bot).length / g.memberCount * 100 >= 75);
    }

    // eslint-disable no-useless-escape
    escapeMarkdown(string) {
        const replacedItallicsAndBold = string.replace(/\*/g, "\\*");
        const replacedBackticks = replacedItallicsAndBold.replace(/\`/g, "\\`");
        const replacedUnderscores = replacedBackticks.replace(/\_/g, "\\_");
        const replacedBrackets = replacedUnderscores.replace(/\[/g, "\\[").replace(/\(/, "\\(").replace(/\]/g, "\\]").replace(/\)/g, "\\)");
        return replacedBrackets;
    }
    
    //actually Client.getRESTUser, but bypasses the need of options.restMode
    /** @deprecated */
    getUserWithoutRESTMode(userID) {
        if (this.users.has(userID)) return Promise.resolve(this.users.get(userID));
        return this.requestHandler.request("GET", ErisEndpoints.USER(userID), true).then((user) => new User(user, this));
    }

    getBaseObject(id) {
        return new Base(id);
    }

    getTag(user) {
        return `${user.username}#${user.discriminator}`;
    }

    embedToText(embed) {
        let txt = [];
        if (embed.title) txt.push(`----------${embed.title} ${embed.url ? `- ${embed.url}` : ""}----------`);
        if (embed.author) txt.push(`${embed.title ? "(" : ""}${embed.author.name || "noname"} - ${embed.author.icon_url || "noiconuri"} - ${embed.author.url || "nouri"}${embed.title ? ")" : ""}`);
        if (embed.description) txt.push(embed.description);
        if (embed.fields) embed.fields.forEach(f => {
            txt.push("--------------------");
            txt.push(f.name);
            txt.push("");
            txt.push(f.value);
            txt.push("--------------------");
        });
        if (embed.thumbnail) txt.push("THUMB: " + embed.thumbnail.url);
        if (embed.image) txt.push(`IMAGE: ${embed.image.url}`);
        if (embed.video) txt.push(`VIDEO: ${embed.video.url}`);
        if (embed.provider) txt.push(`PROVIDER: ${embed.provider.name} ${embed.provider.url}`);
        if (embed.footer) txt.push(`----------${embed.footer.text || "notext"} - ${embed.footer.icon_url || "noiconuri"}----------`);
        return txt.join("\n");
    }
    parseMsg(string, m, g) {
        const replacers = {
            "{g.name}": g.name,
            "{g.id}": g.id,
            "{g.channels}": g.channels.size,
            "{g.members}": g.memberCount,
            "{g.roles}": g.roles.size,
            "{u.mention}": `<@!${m.id}>`,
            "{u.name}": m.username,
            "{u.discrim}": m.discriminator,
            "{u.id}": m.id,
            "{u.tag}": this.getTag(m),
        };
        const regex = new RegExp(Object.keys(replacers).map(t => t.replace(/\./g, "\\.")).join("|"), "gi");
        return string.replace(regex, m => replacers[m]);
    }

    /**
     * @param {string} inviteID 
     * @param {boolean} withCounts 
     */
    getInvite(inviteID, withCounts) {
        const parsed = resolveInvite(inviteID);

        // @ts-expect-error TSDs are nice
        return super.getInvite(parsed, withCounts);
    }
}

export default TTBotClient;