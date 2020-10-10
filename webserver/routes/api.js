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
const { checkAuth, getGuilds } = require("../util/index");
const { v4: createUUID } = require("uuid");
const uuidregex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const authNeeded = checkAuth(true);
const UserProfile = require("../../lib/Structures/UserProfile");
const { ExtensionFlags } = require("../../lib/extensions/API/Constants");
const PRIVILEGED_SCOPES = ["httpRequests", "dangerousGuildSettings"];
const { extensionFlagRequest, prefix, webserverDisplay } = require("../../config");

function isValidTz(tz) {
    try {
        Intl.DateTimeFormat(void 0, { timeZone: tz });
        return true;
    } catch {
        return false;
    }
}

module.exports = (app, csrf, db) => {
    app.get("/api/channels/:guild", authNeeded, (rq, rs) => {
        const guilds = getGuilds(rq, rs);
        if (!guilds.find(g => g.isOnServer && g.id === rq.params.guild)) {
            rs.status(403);
            return rs.send({ error: "Forbidden" });
        } else {
            const guild = rq.bot.guilds.get(rq.params.guild);
            return rs.send(guild.channels.filter(c => c.type === 0).sort((a, b) => a.position - b.position).map(c => ({
                name: c.name,
                id: c.id
            })));
        }
    });

    app.get("/api/config/:guild", authNeeded, async (rq, rs) => {
        const guilds = getGuilds(rq, rs);
        if (!guilds.find(g => g.isOnServer && g.id === rq.params.guild)) {
            rs.status(403);
            return rs.send({ error: "Forbidden" });
        } else {
            const data = await db.getGuildConfig(rq.params.guild);
            return rs.send(data);
        }
    });

    app.get("/api/roles/:guild", authNeeded, (rq, rs) => {
        const guilds = getGuilds(rq, rs);
        if (!guilds.find(g => g.isOnServer && g.id === rq.params.guild)) {
            rs.status(403);
            return rs.send({ error: "Forbidden" });
        } else {
            const guild = rq.bot.guilds.get(rq.params.guild);
            const highestRole = guild.members.get(rq.bot.user.id).roles
                .map(r => guild.roles.get(r))
                .sort((a, b) => b.position - a.position)[0] || {
                position: -1
            };
            let roles = guild.roles.filter(r => r.position < highestRole.position);
            if (rq.query.ignoreHierarchy === "true") roles = [...guild.roles.values()];
            return rs.send(roles.sort((a, b) => b.position - a.position).map(r => ({
                name: r.name,
                id: r.id
            })));
        }
    });

    app.post("/api/config/:guild", authNeeded, csrf(), async (rq, rs) => {
        const guilds = getGuilds(rq, rs);
        if (!guilds.find(g => g.isOnServer && g.id === rq.params.guild)) {
            rs.status(403);
            return rs.send({ error: "Forbidden" });
        } else {
            const props = ["prefix",
                "modRole",
                "farewellMessage",
                "farewellChannelId",
                "greetingMessage",
                "greetingChannelId",
                "agreeChannel",
                "memberRole",
                "logChannel",
                "logEvents",
                "modlogChannel",
                "locale"];
            const filteredBody = {};
            Object.keys(rq.body).filter(k => props.includes(k)).forEach(k => {
                filteredBody[k] = rq.body[k] || null;
            });

            filteredBody.id = rq.params.guild;

            await db.updateGuildConfig(rq.params.guild, filteredBody);
            return rs.send(await db.getGuildConfig(rq.params.guild));
        }
    });

    app.get("/api/extensions/:guild/:id", authNeeded, async (rq, rs) => {
        const d = {
            allowedChannels: [],
            allowedRoles: [],
            commandTrigger: "",
            store: null,
            code: "const { message } = require(\"tt.bot\");\n\nmessage.reply(\"hi!\")",
            name: "My cool extension",
            id: "new",
            flags: 0,
            privilegedFlags: 0
        };
        const { guild, id } = rq.params;
        const guilds = getGuilds(rq, rs);
        if (!guilds.find(g => g.isOnServer && g.id === guild)) return rs.status(403).send({ error: "Forbidden" });
        else {
            if (id === "new") return rs.send(d);
            const filteredBody = {};
            const extension = await db.getGuildExtension(id);
            if (!extension || extension && extension.guildID !== guild) {
                rs.status(404);
                rs.send({ error: "Not Found" });
                return;
            }
            Object.keys(extension).filter(k => Object.keys(d).includes(k)).forEach(k => {
                filteredBody[k] = extension[k] != null ? extension[k] : undefined;
            });
            filteredBody.id = id;
            rs.send(filteredBody);
        }
    });

    app.post("/api/extensions/:guild/:id", authNeeded, csrf(), async (rq, rs) => {
        const { guild, id } = rq.params;
        const guilds = getGuilds(rq, rs);
        if (!guilds.find(g => g.isOnServer && g.id === guild)) {
            rs.status(403);
            return rs.send({ error: "Forbidden" });
        } else {
            const props = [
                "code",
                "allowedChannels",
                "allowedRoles",
                "commandTrigger",
                "name",
                "store",
                "flags"
            ];
            const filteredBody = {};
            const extension = id === "new" ? { guildID: guild } : await db.getGuildExtension(id);
            if (!extension || extension && extension.guildID !== guild) {
                rs.status(404);
                rs.send({ error: "Not Found" });
                return;
            }
            Object.keys(rq.body).filter(k => props.includes(k)).forEach(k => {
                filteredBody[k] = rq.body[k] || undefined;
            });

            filteredBody.id = id;
            filteredBody.guildID = guild;
            if (!filteredBody.name) {
                rs.status(400);
                rs.send({ error: "Extension name missing" });
                return;
            }
            if (!filteredBody.commandTrigger) {
                rs.status(400);
                rs.send({ error: "Command trigger missing" });
                return;
            }

            const reqFlags = [];
            // If the extension code changed, consider the extension untrusted
            if (filteredBody.flags ^ extension.flags 
                || filteredBody.flags ^ extension.privilegedFlags || filteredBody.code !== extension.code) {
                let flagNum = 0;
                let privScopeFlagNum = 0;
                for (const scope of Object.keys(ExtensionFlags)) {
                    if (filteredBody.flags & ExtensionFlags[scope]
                        && PRIVILEGED_SCOPES.includes(scope)) {
                        if (filteredBody.code !== extension.code || 
                        !(extension.flags & ExtensionFlags[scope])
                        && !(extension.privilegedFlags & ExtensionFlags[scope])) {
                            reqFlags.push(scope);
                            privScopeFlagNum |= ExtensionFlags[scope];
                        } else {
                            if (extension.privilegedFlags & ExtensionFlags[scope]) privScopeFlagNum |= ExtensionFlags[scope];
                            else flagNum |= ExtensionFlags[scope];
                        }
                    } else if (filteredBody.flags & ExtensionFlags[scope]) {
                        flagNum |= ExtensionFlags[scope];
                    }
                }
                filteredBody.privilegedFlags = privScopeFlagNum;
                filteredBody.flags = flagNum;
            }

            console.log(filteredBody.flags, filteredBody.privilegedFlags);
            if (filteredBody.commandTrigger.length > 20)
                filteredBody.commandTrigger = filteredBody.commandTrigger.slice(0, 20);
            if (!uuidregex.test(filteredBody.store)) filteredBody.store = null;
            if (id === "new") {
                delete filteredBody.id;
                const tryInsert = async () => {
                    const id = createUUID();
                    try {
                        await db.createGuildExtensionStore(guild, id);
                        return id;
                    } catch (_) {
                        // Try to insert with a different id
                        return tryInsert();
                    }
                };
                //eslint-disable-next-line require-atomic-updates
                filteredBody.store = filteredBody.store || await tryInsert();
                const tryInsertExtension = async () => {
                    const id = createUUID();
                    try {
                        filteredBody.id = id;
                        await db.createGuildExtension(filteredBody);
                        return id;
                    } catch {
                        return tryInsertExtension();
                    }
                };

                const newID = await tryInsertExtension();
                rs.send(await db.getGuildExtension(newID));
            } else {
                await db.updateGuildExtension(id, filteredBody);
                rs.send(await db.getGuildExtension(id));
            }

            if (reqFlags.length) {
                await rq.bot.executeWebhook(extensionFlagRequest.id, extensionFlagRequest.token, {
                    content: filteredBody.id,
                    embeds: [{
                        title: `"${filteredBody.name}" requested a privileged flag`,
                        description: `**Requested scopes:**\n${reqFlags.join(", ")}\n\n[View the extension](${webserverDisplay(`/dashboard/${filteredBody.guildID}/extensions/${filteredBody.id}`)})`,
                        color: 0x008800,
                        footer: {
                            text: `Type ${prefix}allowextflag ${filteredBody.id} <flags> to grant these extension flags`
                        }
                    }]
                });
            }
        }
    });

    app.delete("/api/extensions/:guild/:id", authNeeded, csrf(), async (rq, rs) => {
        const { guild, id } = rq.params;
        const guilds = getGuilds(rq, rs);
        if (!guilds.find(g => g.isOnServer && g.id === guild)) {
            rs.status(403);
            return rs.send({ error: "Forbidden" });
        } else {
            const extension = await db.getGuildExtension(id);
            if (!extension || extension && extension.guildID !== guild) {
                rs.status(404);
                rs.send({ error: "Not Found" });
                return;
            }

            const { deleteStore } = rq.body;
            await db.deleteGuildExtension(id);
            if (deleteStore) {
                await db.deleteGuildExtensionStore(guild, extension.store);
            }
            rs.status(204);
            return rs.end();
        }
    });

    app.get("/api/profile", authNeeded, csrf(), async (rq, rs) => {
        const profileData = await db.getUserProfile(rq.user.id);
        if (!profileData) {
            rs.status(404);
            rs.send({ error: "Not Found" });
        }
        const profile = new UserProfile(profileData);
        rs.send({
            ...profile,
            csrfToken: rq.csrfToken()
        });
    });

    app.post("/api/profile", authNeeded, csrf(), async (rq, rs) => {
        const props = ["timezone",
            "locale"];
        const filteredBody = {};
        Object.keys(rq.body).filter(k => props.includes(k)).forEach(k => {
            filteredBody[k] = rq.body[k] || null;
        });
        filteredBody.id = rq.user.id;
        if (!Object.keys(rq.bot.i18n.languages).includes(filteredBody.locale)) {
            rs.status(400);
            rs.send({
                error: "Invalid locale"
            });
            return;
        }
        if (!isValidTz(filteredBody.timezone)) {
            rs.status(400);
            rs.send({
                error: "Invalid timezone. Refer to https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List for a list of correct timezones"
            });
            return;
        }

        const profile = UserProfile.create(filteredBody);
        if (!await db.getUserProfile(rq.user.id)) {
            await db.createUserProfile(profile);
        } else {
            await db.updateUserProfile(rq.user.id, profile);
        }

        const profileData = await db.getUserProfile(rq.user.id);
        return rs.send(new UserProfile(profileData));
    });

    app.delete("/api/profile", authNeeded, csrf(), async (rq, rs) => {
        await db.deleteUserProfile(rq.user.id);
        rs.status(204);
        rs.end();
    });
    return app;
};