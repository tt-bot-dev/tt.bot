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

import { Command, Eris } from "sosamba";
import UserProfile from "../lib/Structures/UserProfile.mjs";
import { t, formatDate } from "../lib/util.mjs";

const { Constants: { ApplicationCommandOptionTypes } } = Eris;

class TimeForCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "timefor",
            description: "Gets the current time of a user.",
            args: [{
                name: "user",
                description: "The user to get the time for.",
                type: ApplicationCommandOptionTypes.USER,
                required: true,
            }],
        });
    }

    async run(ctx, { user }) {
        const profile = await this.sosamba.db.getUserProfile(user.id);
        if (!profile) return await ctx.send(
            await t(ctx, `PROFILE${user.id === ctx.author.id ? "" : "_SPECIFIC"}_NONEXISTENT`,
                { user: this.sosamba.getTag(user) }));
        const data = new UserProfile(profile);
        if (!data.timezone) return await ctx.send(await t(ctx, "NO_TZ"));
        return ctx.send(await t(ctx, "TIME_FOR", {
            time: await formatDate(ctx, Date.now(), data.timezone),
            user: this.sosamba.getTag(user),
        }));
    }
}

export default TimeForCommand;
