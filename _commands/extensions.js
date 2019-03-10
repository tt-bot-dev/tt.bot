const { get } = require("snekfetch");
const askYesNo = require("../util/askYesNo");

module.exports = {
    exec: async function (msg, args) {
        const [action, id] = args.split(" ");
        if (action === "list") {
            const extensions = await db.table("extensions").filter({
                guildID: msg.guild.id
            });
            if (extensions.length === 0) return msg.channel.createMessage(msg.t("NO_EXTENSIONS"));
            let page = 0;
            if (id > 1) page = Number(id - 1);
            if (isNaN(page)) page = 0;
            let pageI = page * 25 - 1;
            if (page === 0) pageI = 0;
            let ext = extensions.slice(pageI, (page + 1) * 25 - 1);
            if (ext.length === 0) return msg.channel.createMessage(msg.t("NO_MORE_EXTENSIONS"));
            msg.channel.createMessage({
                embed: {
                    title: msg.t("EXTENSION_LIST", msg.guild),
                    description: msg.t("PAGE", page + 1),
                    fields: ext.map(e => ({
                        name: e.name,
                        value: msg.t("EXTENSION_LIST_FIELD", e)
                    })),
                    color: 0x008800
                }
            });
        } else if (action === "create") {
            const m = await msg.channel.createMessage(msg.t("QUESTION_EXTENSION_CODE"));
            let code;
            try {
                const [m] = await bot.waitForEvent("messageCreate", 60000, m => {
                    if (m.channel.id !== msg.channel.id) return false;
                    if (m.author.id !== msg.author.id) return false;
                    if (m.attachments.length === 0) return false;
                    if (!m.attachments.find(a => /.+\.js$/.test(a.filename))) return false;
                    return true;
                });
                code = m;
            } catch (_) {
                msg.channel.createMessage(msg.t("OP_CANCELLED"));
                return;
            }
            const { body } = await get(code.attachments.find(a => /.+\.js$/.test(a.filename)).url);
            const jsCode = body.toString();
            await m.delete();
            try {
                await code.delete();
            } catch (_) {
                // ok :/
            }
            const m2 = await msg.channel.createMessage(msg.t("QUESTION_EXTENSION_NAME"));
            let name;
            try {
                const [m] = await bot.waitForEvent("messageCreate", 60000, m => {
                    if (m.channel.id !== msg.channel.id) return false;
                    if (m.author.id !== msg.author.id) return false;
                    if (m.content.length > 100) return false;
                    return true;
                });
                name = m;
            } catch (_) {
                msg.channel.createMessage(msg.t("OP_CANCELLED"));
                return;
            }
            const extensionName = name.content;
            await m2.delete();
            try {
                await name.delete();
            } catch (_) {
                // ok :/
            }

            const m3 = await msg.channel.createMessage(msg.t("QUESTION_EXTENSION_TRIGGER"));
            let trigger;
            try {
                const [m] = await bot.waitForEvent("messageCreate", 20000, m => {
                    if (m.channel.id !== msg.channel.id) return false;
                    if (m.author.id !== msg.author.id) return false;
                    if (m.content.includes(" ")) return false;
                    if (m.content.length > 20) return false;
                    return true;
                });
                trigger = m;
            } catch (_) {
                msg.channel.createMessage(msg.t("OP_CANCELLED"));
                return;
            }
            const commandTrigger = trigger.content;
            await m3.delete();
            try {
                await trigger.delete();
            } catch (_) {
                // ok :/
            }

            const m4 = await msg.channel.createMessage(msg.t("QUESTION_EXTENSION_CHANNEL_RESTRICT"));
            const { response, msg: res } = await askYesNo(msg, true);
            await m4.delete();
            try {
                await res.delete();
            } catch (_) {
                // ok :/
            }

            let allowedChannels = [];
            if (response) {
                const embedStructure = () => ({
                    embed: {
                        title: msg.t("ALLOWED_CHANNELS"),
                        description: msg.t("EXTENSION_MENU_SUBTEXT", `\n${msg.t("MENU_CURRENTLY_SELECTED")} ${allowedChannels.map(c => `<#${c}>`).join(", ") || "All"}`),
                        fields: [{
                            name: msg.t("ALLOWED_CHANNELS_ACTION_ADD"),
                            value: msg.t("ALLOWED_CHANNELS_ACTION_ADD_DESCRIPTION"),
                            inline: true
                        }, {
                            name: msg.t("ALLOWED_CHANNELS_ACTION_REMOVE"),
                            value: msg.t("ALLOWED_CHANNELS_ACTION_REMOVE_DESCRIPTION"),
                            inline: true
                        }, {
                            name: msg.t("ALLOWED_CHANNELS_ACTION_DONE"),
                            value: msg.t("ALLOWED_CHANNELS_ACTION_DONE_DESCRIPTION"),
                            inline: true
                        }]
                    }
                });
                const m = await msg.channel.createMessage(embedStructure());
                let firstCycle = false;

                // eslint I hope you realize that I break out of the loop eventually
                // eslint-disable-next-line no-constant-condition
                while (!0) {
                    if (firstCycle) {
                        await m.edit(embedStructure());
                    } else {
                        firstCycle = true;
                    }
                    try {
                        const [resp] = await bot.waitForEvent("messageCreate", 20000, m => {
                            if (m.channel.id !== msg.channel.id) return false;
                            if (m.author.id !== msg.author.id) return false;
                            if (m.content.toLowerCase() !== "a" && m.content.toLowerCase() !== "r" && m.content.toLowerCase() !== "d") return false;
                            return true;
                        });
                        try {
                            await resp.delete();
                        } catch (_) {
                            // :(
                        }
                        const action = resp.content.toLowerCase();
                        if (action === "a") {
                            const m2 = await msg.channel.createMessage(msg.t("QUESTION_ALLOWED_CHANNELS_ADD"));
                            let c;
                            try {
                                const [m] = await bot.waitForEvent("messageCreate", 30000, m => {
                                    if (m.channel.id !== msg.channel.id) return false;
                                    if (m.author.id !== msg.author.id) return false;
                                    return true;
                                });
                                c = await queries.channel(m.content, m, true);
                                try {
                                    await m.delete();
                                } catch (_) {
                                    // oki :^)
                                }
                            } catch (_) {
                                msg.channel.createMessage(msg.t("COMMAND_ERROR"));
                                continue;
                            }
                            if (allowedChannels.find(ch => ch === c.id)) {
                                msg.channel.createMessage(msg.t("CHANNEL_ALLOWED_ALREADY"));
                                continue;
                            }
                            allowedChannels.push(c.id);
                            await m2.delete();
                            continue;
                        } else if (action === "r") {
                            const m2 = await msg.channel.createMessage(msg.t("QUESTION_ALLOWED_CHANNELS_REMOVE"));
                            let c;
                            try {
                                const [m] = await bot.waitForEvent("messageCreate", 30000, m => {
                                    if (m.channel.id !== msg.channel.id) return false;
                                    if (m.author.id !== msg.author.id) return false;
                                    return true;
                                });
                                c = await queries.channel(m.content, m, true);
                                try {
                                    await m.delete();
                                } catch (_) {
                                    // oki :^)
                                }
                            } catch (_) {
                                msg.channel.createMessage(msg.t("COMMAND_ERROR"));
                                continue;
                            }
                            if (!allowedChannels.find(ch => ch === c.id)) {
                                msg.channel.createMessage(msg.t("CHANNEL_DISALLOWED_ALREADY"));
                                continue;
                            }
                            allowedChannels.splice(allowedChannels.indexOf(c.id), 1);
                            await m2.delete();
                            continue;
                        } else if (action === "d") {
                            await m.delete();
                            break;
                        }
                    } catch (_) {
                        msg.channel.createMessage(msg.t("ALLOWED_CHANNELS_MENU_CANCELLED"));
                        await m.delete();
                        break;
                    }
                }
            }


            const m5 = await msg.channel.createMessage(msg.t("QUESTION_EXTENSION_ROLE_RESTRICT"));
            const { response: response2, msg: res2 } = await askYesNo(msg, true);
            await m5.delete();
            try {
                await res2.delete();
            } catch (_) {
                // ok :/
            }

            let allowedRoles = [];
            if (response2) {
                const embedStructure = () => ({
                    embed: {
                        title: msg.t("ALLOWED_ROLES"),
                        description: msg.t("EXTENSION_MENU_SUBTEXT", `\n${msg.t("MENU_CURRENTLY_SELECTED"), true} ${allowedRoles.map(c => `<@&${c}>`).join(", ") || "All"}`),
                        fields: [{
                            name: msg.t("ALLOWED_CHANNELS_ACTION_ADD"),
                            value: msg.t("ALLOWED_CHANNELS_ACTION_ADD_DESCRIPTION", true),
                            inline: true
                        }, {
                            name: msg.t("ALLOWED_CHANNELS_ACTION_REMOVE"),
                            value: msg.t("ALLOWED_CHANNELS_ACTION_ADD_DESCRIPTION", true),
                            inline: true
                        }, {
                            name: msg.t("ALLOWED_CHANNELS_ACTION_DONE"),
                            value: msg.t("ALLOWED_CHANNELS_ACTION_DONE_DESCRIPTION"),
                            inline: true
                        }]
                    }
                });
                const m = await msg.channel.createMessage(embedStructure());
                let firstCycle = false;
                
                // eslint I hope you realize that I break out of the loop eventually
                // eslint-disable-next-line no-constant-condition
                while (!0) {
                    if (firstCycle) {
                        await m.edit(embedStructure());
                    } else {
                        firstCycle = true;
                    }
                    try {
                        const [resp] = await bot.waitForEvent("messageCreate", 20000, m => {
                            if (m.channel.id !== msg.channel.id) return false;
                            if (m.author.id !== msg.author.id) return false;
                            if (m.content.toLowerCase() !== "a" && m.content.toLowerCase() !== "r" && m.content.toLowerCase() !== "d") return false;
                            return true;
                        });
                        try {
                            await resp.delete();
                        } catch (_) {
                            // :(
                        }
                        const action = resp.content.toLowerCase();
                        if (action === "a") {
                            const m2 = await msg.channel.createMessage(msg.t("QUESTION_ALLOWED_CHANNELS_ADD", true));
                            let role;
                            try {
                                const [m] = await bot.waitForEvent("messageCreate", 30000, m => {
                                    if (m.channel.id !== msg.channel.id) return false;
                                    if (m.author.id !== msg.author.id) return false;
                                    return true;
                                });
                                role = await queries.role(m, m.content, true);
                                try {
                                    await m.delete();
                                } catch (_) {
                                    // oki :^)
                                }
                            } catch (_) {
                                msg.channel.createMessage(msg.t("COMMAND_ERROR"));
                                continue;
                            }
                            
                            if (allowedRoles.find(r => r === role.id)) {
                                msg.channel.createMessage(msg.t("CHANNEL_ALLOWED_ALREADY", true));
                                continue;
                            }
                            allowedRoles.push(role.id);
                            await m2.delete();
                            continue;
                        } else if (action === "r") {
                            const m2 = await msg.channel.createMessage(msg.t("QUESTION_ALLOWED_CHANNELS_REMOVE"));
                            let role;
                            try {
                                const [m] = await bot.waitForEvent("messageCreate", 30000, m => {
                                    if (m.channel.id !== msg.channel.id) return false;
                                    if (m.author.id !== msg.author.id) return false;
                                    return true;
                                });
                                role = await queries.role(m, m.content, true);
                                try {
                                    await m.delete();
                                } catch (_) {
                                    // oki :^)
                                }
                            } catch (_) {
                                msg.channel.createMessage(msg.t("COMMAND_ERROR"));
                                continue;
                            }
                            if (!allowedRoles.find(r => r === role.id)) {
                                msg.channel.createMessage(msg.t("CHANNEL_DISALLOWED_ALREADY", true));
                                continue;
                            }
                            allowedRoles.splice(allowedRoles.indexOf(role.id), 1);
                            await m2.delete();
                            continue;
                        } else if (action === "d") {
                            await m.delete();
                            break;
                        }
                    } catch (_) {
                        msg.channel.createMessage(msg.t("ALLOWED_CHANNELS_MENU_CANCELLED", true));
                        await m.delete();
                        break;
                    }
                }
            }

            const m6 = await msg.channel.createMessage(msg.t("QUESTION_EXTENSION_STORE"));
            const { response: r6, msg: s } = await askYesNo(msg, true);
            await m6.delete();
            try {
                await s.delete();
            } catch (_) {
                // :(
            }

            let store;
            if (r6) {
                const m = await msg.channel.createMessage(msg.t("QUESTION_EXTENSION_STORE_ID"));
                let s;
                try {
                    const [res] = await bot.waitForEvent("messageCreate", 20000, m => {
                        if (m.channel.id !== msg.channel.id) return false;
                        if (m.author.id !== msg.author.id) return false;
                        if (m.content.length > 100) return false;
                        return true;
                    });
                    s = res;
                } catch (_) {
                    msg.channel.createMessage(msg.t("OP_CANCELLED"));
                    return;
                }
                await m.delete();
                try {
                    await s.delete();
                } catch (_) {
                    // ok
                }
                const stor = await db.table("extension_store").get([msg.guild.id, s.content]);
                if (!stor) {
                    msg.channel.createMessage(msg.t("STORE_NONEXISTANT"));
                    return;
                }
                store = stor.id;
            } else {
                const tryInsert = async () => {
                    const id = await db.uuid();
                    try {
                        await db.table("extension_store").insert({
                            id: [msg.guild.id, id],
                            store: "{}"
                        }, {
                            conflict: "error"
                        });
                        return id;
                    } catch (_) {
                        // Try to insert with a different id
                        return tryInsert();
                    }
                };
                store = await tryInsert();
                await msg.channel.createMessage(msg.t("STORE_CREATED", store));
            }

            // FINALLY INSERT !!!
            const info = await db.table("extensions").insert({
                code: jsCode,
                allowedChannels,
                allowedRoles,
                name: extensionName,
                commandTrigger,
                guildID: msg.guild.id,
                store
            });

            await msg.channel.createMessage(msg.t("EXTENSION_CREATED", extensionName, info.generated_keys[0]));
        } else if (action === "delete") {
            const d = await db.table("extensions").get(id);
            if (!d || (d && d.guildID !== msg.guild.id)) {
                msg.channel.createMessage(msg.t("EXTENSION_NONEXISTANT"));
                return;
            }
            await msg.channel.createMessage(msg.t("QUESTION_EXTENSION_DELETE", d));
            const r = await askYesNo(msg);
            if (r) {
                await db.table("extensions").get(id).delete();
                await msg.channel.createMessage(msg.t("QUESTION_EXTENSION_DELETE_STORE", d));
                const r = await askYesNo(msg);
                if (r) {
                    const d = await db.table("extension_store").get([msg.guild.id, d.store]);
                    if (!d) {
                        await msg.channel.createMessage(msg.t("STORE_DELETE_NONEXISTANT"));
                        return;
                    }
                    await db.table("extension_store").get([msg.guild.id, d.store]).delete();
                    await msg.channel.createMessage(msg.t("STORE_DELETED", d));

                }
            } else {
                await msg.channel.createMessage(msg.t("OP_CANCELLED"));
            }
        } else {
            await cmds.help.exec(msg, "extensions");
        }
    },
    isCmd: true,
    display: true,
    category: 4,
    description: "Allows you to manage your extensions.",
    args: "<list [page]|create|delete <id>>"
};