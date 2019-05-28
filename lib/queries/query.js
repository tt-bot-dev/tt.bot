"use strict";
module.exports = class Query {
    constructor(query, items, compareFunc, displayFunc = s => s, notFoundFunc = () => "") {
        if (!query || !items) throw new Error("Missing parameters");
        this._notFound = notFoundFunc;
        this._items = items.filter(compareFunc(query));
        this._displayFunction = displayFunc;
        this._query = query;
    }

    async start(msg) {
        let binds = {};
        if (this._items.length == 0) {
            await msg.channel.createMessage(msg.t("ITEM_NOT_FOUND", this._query, this._notFound(this._query)));
            throw "Item not found";
        } else if (this._items.length == 1) {
            return this._items[0];
        } else if (this._items.length >= 2) {
            let uarr = [];
            let numbers = [":one:", ":two:", ":three:", ":four:", ":five:"];
            let numbersUnicode = ["\u0031\u20E3", "\u0032\u20E3", "\u0033\u20E3", "\u0034\u20E3", "\u0035\u20E3"];
            const listUsers = () => {
                for (let i = 0; i <= 4; i++) {
                    let u = this._items[i];
                    if (u) {
                        uarr.push(numbers[i] + `    ${this._displayFunction(u)}`);
                        binds[numbersUnicode[i]] = u;
                    }
                }
                return uarr.join("\n");
            };
            try {
                const m = await bot.createMessage(msg.channel.id, {
                    embed: {
                        title: msg.t("MULTIPLE_ITEMS_FOUND"),
                        description: msg.t("MULTIPLE_ITEMS_DESCRIPTION", this._items.length, listUsers())
                    }
                });
                return new Promise(async (rs, rj) => {
                    let tout = setTimeout(() => {
                        bot.removeListener("messageReactionAdd", r);
                        m.delete();
                        bot.createMessage(msg.channel.id, msg.t("OP_CANCELLED"));
                        rj("Canceled automatically.");
                    }, 300000);
                    try {
                        await Promise.all(Object.keys(binds).map(r => m.addReaction(r)));
                    } catch (err) {
                        bot.createMessage(msg.channel.id, msg.t("OP_CANCELLED"));
                        rj("Cannot add reactions");
                    }
                    m.addReaction("❌");
                    function r(me, e, u) {
                        if (u != msg.author.id) return;
                        if (me.id != m.id) return;
                        if (e.name == "❌") {
                            bot.removeListener("messageReactionAdd", r);
                            m.delete(); bot.createMessage(msg.channel.id, msg.t("OP_CANCELLED"));
                            rj("Cancelled by user");
                            clearTimeout(tout);
                        }
                        let bindUser = binds[e.name];
                        if (bindUser) {
                            m.delete();
                            clearTimeout(tout);
                            bot.removeListener("messageReactionAdd", r);
                            return rs(bindUser);
                        }
                    }
                    bot.on("messageReactionAdd", r);
                });
            } catch (err) {
                throw "Cannot embed/send messages";
            }
        }
    }
};