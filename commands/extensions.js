const { get } = require("snekfetch");
const askYesNo = require("../util/askYesNo");

module.exports = {
    exec: async function (msg, args) {
        const [action, id] = args.split(" ");
        if (action === "list") {
            const extensions = await db.table("extensions").filter({
                guildID: msg.guild.id
            });
            if (extensions.length === 0) return msg.channel.createMessage("You don't have any extensions yet!")
            let page = 0;
            if (id > 1) page = Number(id - 1)
            if (isNaN(page)) page = 0;
            let ext = extensions.slice(page * 25 - 1, (page + 1) * 25 - 1);
            if (ext.length === 0) return msg.channel.createMessage("There aren't any more extensions than that.")
            msg.channel.createMessage({
                embed: {
                    title: `Here are the extensions for ${msg.guild.name}`,
                    description: `Page ${page + 1}`,
                    fields: ext.map(e => ({
                        name: e.name,
                        value: `
ID: ${e.id}
Allowed channels: ${e.allowedChannels.map(c => `<#${c}>`).join(", ") || "All"}
Allowed roles: ${e.allowedRoles.map(r => `<@&${r}>`).join(", ") || "All"}`
                    })),
                    color: 0x008800
                }
            })
        } else if (action === "create") {
            const m = await msg.channel.createMessage("Please upload your code as a Discord attachment. You have 60 seconds to upload the code.\nKeep in mind, that the code must be a in a .js file.");
            let code;
            try {
                const [m] = await bot.waitForEvent("messageCreate", 60000, m => {
                    if (m.channel.id !== msg.channel.id) return false;
                    if (m.author.id !== msg.author.id) return false;
                    if (m.attachments.length === 0) return false;
                    if (!m.attachments.find(a => /.+\.js$/.test(a.filename))) return false;
                    return true;
                })
                code = m;
            } catch (_) {
                msg.channel.createMessage(msg.t("OP_CANCELLED"));
                return;
            }
            const { body } = await get(code.attachments.find(a => /.+\.js$/.test(a.filename)).url)
            const jsCode = body.toString();
            await m.delete();
            try {
                await code.delete();
            } catch (_) {
                // ok :/
            }
            const m2 = await msg.channel.createMessage("Please tell me how would you like to name your extension. The limit for the name is 100 characters. You have 60 seconds to respond.");
            let name;
            try {
                const [m] = await bot.waitForEvent("messageCreate", 60000, m => {
                    if (m.channel.id !== msg.channel.id) return false;
                    if (m.author.id !== msg.author.id) return false;
                    if (m.content.length > 100) return false;
                    return true;
                })
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

            const m3 = await msg.channel.createMessage("Please tell me what command trigger would you like to use. The limit for the command trigger is 20 characters. Also, you cannot use spaces in the trigger. You have 20 seconds to respond.");
            let trigger;
            try {
                const [m] = await bot.waitForEvent("messageCreate", 20000, m => {
                    if (m.channel.id !== msg.channel.id) return false;
                    if (m.author.id !== msg.author.id) return false;
                    if (m.content.split(" ").length > 1) return false;
                    if (m.content.length > 20) return false;
                    return true;
                })
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

            const m4 = await msg.channel.createMessage("Would you like to restrict running the extension to certain channels? Type y or yes if you want to, n or no otherwise. You have 10 seconds to respond.");
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
                        title: `Allowed channels`,
                        description: `Please type in the letter next to the action to do the listed action\nCurrently allowed channels: ${allowedChannels.map(c => `<#${c}>`).join(", ") || "All"}`,
                        fields: [{
                            name: `a: Add`,
                            value: `Adds a channel to the list of allowed channels`,
                            inline: true
                        }, {
                            name: `r: Remove`,
                            value: `Removes a channel off the list of allowed channels`,
                            inline: true
                        }, {
                            name: `d: Done`,
                            value: `Finishes editing`,
                            inline: true
                        }]
                    }
                })
                const m = await msg.channel.createMessage(embedStructure());
                let firstCycle = false;
                while (!0) {
                    if (firstCycle) {
                        await m.edit(embedStructure())
                    } else {
                        firstCycle = true;
                    }
                    try {
                        const [resp] = await bot.waitForEvent("messageCreate", 20000, m => {
                            if (m.channel.id !== msg.channel.id) return false;
                            if (m.author.id !== msg.author.id) return false;
                            if (m.content.toLowerCase() !== "a" && m.content.toLowerCase() !== "r" && m.content.toLowerCase() !== "d") return false;
                            return true;
                        })
                        try {
                            await resp.delete();
                        } catch (_) {
                            // :(
                        }
                        const action = resp.content.toLowerCase();
                        if (action === "a") {
                            const m2 = await msg.channel.createMessage("Please type in the channel you want to add in. You have 30 seconds to respond.");
                            let c;
                            try {
                                const [m] = await bot.waitForEvent("messageCreate", 30000, m => {
                                    if (m.channel.id !== msg.channel.id) return false;
                                    if (m.author.id !== msg.author.id) return false;
                                    return true;
                                })
                                c = await queries.channel(m.content, m, true)
                                try {
                                    await m.delete();
                                } catch (_) {
                                    // oki :^)
                                }
                            } catch (_) {
                                msg.channel.createMessage("Didn't catch that; please try again.");
                                continue;
                            }
                            allowedChannels.push(c.id);
                            await m2.delete();
                            continue;
                        } else if (action === "r") {
                            const m2 = await msg.channel.createMessage("Please type in the channel you want to remove. You have 30 seconds to respond.");
                            let c;
                            try {
                                const [m] = await bot.waitForEvent("messageCreate", 30000, m => {
                                    if (m.channel.id !== msg.channel.id) return false;
                                    if (m.author.id !== msg.author.id) return false;
                                    return true;
                                })
                                c = await queries.channel(m.content, m, true)
                                try {
                                    await m.delete();
                                } catch (_) {
                                    // oki :^)
                                }
                            } catch (_) {
                                msg.channel.createMessage("Didn't catch that; please try again.");
                                continue;
                            }
                            if (!allowedChannels.find(ch => ch === c.id)) {
                                msg.channel.createMessage("This channel is not allowed already.")
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
                        msg.channel.createMessage("Menu cancelled due to inactivity; the channels that were selected already will be used.");
                        await m.delete();
                        break;
                    }
                }
            }


            const m5 = await msg.channel.createMessage("Would you like to restrict running the extension to members with certain roles? Type y or yes if you want to, n or no otherwise. You have 10 seconds to respond.");
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
                        title: `Allowed roles`,
                        description: `Please type in the letter next to the action to do the listed action\nCurrently allowed roles: ${allowedRoles.map(c => `<@&${c}>`).join(", ") || "All"}`,
                        fields: [{
                            name: `a: Add`,
                            value: `Adds a role to the list of allowed roles`,
                            inline: true
                        }, {
                            name: `r: Remove`,
                            value: `Removes a role off the list of allowed roles`,
                            inline: true
                        }, {
                            name: `d: Done`,
                            value: `Finishes editing`,
                            inline: true
                        }]
                    }
                })
                const m = await msg.channel.createMessage(embedStructure());
                let firstCycle = false;
                while (!0) {
                    if (firstCycle) {
                        await m.edit(embedStructure())
                    } else {
                        firstCycle = true;
                    }
                    try {
                        const [resp] = await bot.waitForEvent("messageCreate", 20000, m => {
                            if (m.channel.id !== msg.channel.id) return false;
                            if (m.author.id !== msg.author.id) return false;
                            if (m.content.toLowerCase() !== "a" && m.content.toLowerCase() !== "r" && m.content.toLowerCase() !== "d") return false;
                            return true;
                        })
                        try {
                            await resp.delete();
                        } catch (_) {
                            // :(
                        }
                        const action = resp.content.toLowerCase();
                        if (action === "a") {
                            const m2 = await msg.channel.createMessage("Please type in the role you want to add in. You have 30 seconds to respond.");
                            let r;
                            try {
                                const [m] = await bot.waitForEvent("messageCreate", 30000, m => {
                                    if (m.channel.id !== msg.channel.id) return false;
                                    if (m.author.id !== msg.author.id) return false;
                                    return true;
                                })
                                r = await queries.role(m, m.content, true)
                                try {
                                    await m.delete();
                                } catch (_) {
                                    // oki :^)
                                }
                            } catch (_) {
                                msg.channel.createMessage("Didn't catch that; please try again.");
                                continue;
                            }
                            allowedRoles.push(r.id);
                            await m2.delete();
                            continue;
                        } else if (action === "r") {
                            const m2 = await msg.channel.createMessage("Please type in the role you want to remove. You have 30 seconds to respond.");
                            let r;
                            try {
                                const [m] = await bot.waitForEvent("messageCreate", 30000, m => {
                                    if (m.channel.id !== msg.channel.id) return false;
                                    if (m.author.id !== msg.author.id) return false;
                                    return true;
                                })
                                r = await queries.role(m, m.content, true)
                                try {
                                    await m.delete();
                                } catch (_) {
                                    // oki :^)
                                }
                            } catch (_) {
                                msg.channel.createMessage("Didn't catch that; please try again.");
                                continue;
                            }
                            if (!allowedRoles.find(r => r === r.id)) {
                                msg.channel.createMessage("This role is not allowed already.")
                                continue;
                            }
                            allowedRoles.splice(allowedRoles.indexOf(c.id), 1);
                            await m2.delete();
                            continue;
                        } else if (action === "d") {
                            await m.delete();
                            break;
                        }
                    } catch (_) {
                        msg.channel.createMessage("Menu cancelled due to inactivity; the roles that were selected already will be used.");
                        await m.delete();
                        break;
                    }
                }
            }

            const m6 = await msg.channel.createMessage("Do you want to use a different extension store than the default one? Type y or yes if you want to use one. n or no otherwise. To respond, you have 10 seconds.")
            const { response: r6, msg: s } = await askYesNo(msg, true);
            await m6.delete();
            try {
                await s.delete();
            } catch (_) {
                // :(
            }

            let store;
            if (r6) {
                const m = await msg.channel.createMessage("Type in the store ID now.");
                let s;
                try {
                    const [res] = await bot.waitForEvent("messageCreate", 20000, m => {
                        if (m.channel.id !== msg.channel.id) return false;
                        if (m.author.id !== msg.author.id) return false;
                        if (m.content.length > 100) return false;
                        return true;
                    })
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
                    msg.channel.createMessage("This store doesn't exist.");
                    return;
                }
                store = stor.id;
            } else {
                const tryInsert = async () => {
                    const id = await r.uuid();
                    try {
                        await db.table("extension_store").insert({
                            id: [msg.guild.id, id],
                            store: "{}"
                        }, {
                                conflict: "error"
                            });
                    } catch (_) {
                        // Try to insert with a different id
                        return tryInsert();
                    } finally {
                        return id;
                    }
                }
                store = await tryInsert();
                await msg.channel.createMessage(`Created a store with an ID ${store}.`)
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
            })

            await msg.channel.createMessage(`Finished! Extension ${extensionName} has been successfully created! Its ID is ${info.generated_keys[0]}.`)
        } else if (action === "delete") {
            const d = await db.table("extensions").get(id);
            if (!d || (d && d.guildID !== msg.guild.id)) {
                msg.channel.createMessage("This extension doesn't exist.");
                return;
            }
            await msg.channel.createMessage(`Are you sure you want to delete the extension ${d.name} (ID ${d.id})? Type y or yes if you want to. n or no otherwise. To respond, you have 10 seconds.`);
            const r = await askYesNo(msg);
            if (r) {
                await db.table("extensions").get(id).delete();
                await msg.channel.createMessage(`Done! The extension ${d.name} is deleted.\nWould you also like to delete its store (ID ${d.store})? Type y or yes if you want to. n or no otherwise. To respond, you have 10 seconds.`);
                const r = await askYesNo(msg);
                if (r) {
                    const d = await db.table("extension_store").get([msg.guild.id, d.store]);
                    if (!d) {
                        await msg.channel.createMessage("Alright, the store doesn't exist.");
                        return;
                    }
                    await db.table("extension_store").get([msg.guild.id, d.store]).delete();
                    await msg.channel.createMessage(`Done, deleted the store with an ID ${d.store}`)

                }
            } else {
                await msg.channel.createMessage(msg.t("OP_CANCELLED"));
            }
        }
    },
    isCmd: true,
    display: true,
    category: 4,
    description: "Allows you to manage your extensions.",
    args: "<list [page]|create|delete <id>>"
};