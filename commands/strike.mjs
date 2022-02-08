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

import Command from "../lib/commandTypes/ModCommand.mjs";
import { Eris } from "sosamba";
import UserProfile from "../lib/Structures/UserProfile.mjs";
import { PunishTypes } from "../lib/modlog/constants.mjs";
import { t } from "../lib/util.mjs";

const { Constants: { ApplicationCommandOptionTypes } } = Eris;

class StrikeCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "strike",
            description: "Strikes a user.",
            args: [{
                name: "user",
                description: "The user to strike.",
                type: ApplicationCommandOptionTypes.USER,
                required: true,
            }, {
                name: "reason",
                description: "The reason for the ban",
                type: ApplicationCommandOptionTypes.STRING,
                required: false
            }],
            aliases: ["warn"],
            guildOnly: true,
        });
    }

    async run(ctx, { user, reason }) {
        const _reason = reason ?? "No reason provided.";
        if (user.bot) return ctx.send(await t(ctx, "BOTS_NOT_STRIKABLE"));
        await this.sosamba.modLog.createPunishment(ctx, PunishTypes.STRIKE, user.id, _reason);
        const [dm, p] = await Promise.all([
            user.user.getDMChannel(),
            this.sosamba.db.getUserProfile(user.id)
        ]);
        const prof = new UserProfile(p || {});
        try {
            await dm.createMessage({
                embeds: [{
                    title: await this.sosamba.localeManager.translate(prof.locale || "en", "YOU_GOT_STRIKED"),
                    description: await this.sosamba.localeManager.translate(prof.locale || "en", "STRIKE_DETAILS", {
                        issuer: this.sosamba.getTag(ctx.author),
                        reason: _reason
                    }),
                    footer: {
                        text: await this.sosamba.localeManager.translate(prof.locale || "en", "PAY_ATTENTION")
                    },
                    timestamp: new Date()
                }]
            });
        } catch { }
        await ctx.send(":ok_hand:");
    }
}

export default StrikeCommand;