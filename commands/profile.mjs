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
import { getUserProfile, setUserProfile, t } from "../lib/util.mjs";
// import UserProfile from "../lib/Structures/UserProfile.mjs";

const { Constants: { ApplicationCommandOptionTypes, ComponentTypes } } = Eris;

class ProfileCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "profile",
            description: "Manages the data we know about you.",
            args: [
                {
                    name: "update",
                    description: "Updates your user profile (and creates one if you don't have one)",
                    type: ApplicationCommandOptionTypes.SUB_COMMAND,
                    options: [
                        {
                            name: "timezone",
                            description: "The timezone to use",
                            type: ApplicationCommandOptionTypes.STRING,
                            required: false,
                        }, {
                            name: "locale",
                            description: "The locale to use",
                            type: ApplicationCommandOptionTypes.STRING,
                            choices: ProfileCommand.getLocales(sosamba),
                            required: false,
                        },
                    ],
                },
                {
                    name: "remove",
                    description: "Removes the user profile",
                    type: ApplicationCommandOptionTypes.SUB_COMMAND,
                },
            ],
        });
    }

    async run(ctx, { timezone, locale }) {
        switch (ctx.subcommand) {
        case "remove": {
            if ((await getUserProfile(ctx)).fake) {
                await ctx.send({
                    content: await t(ctx, "PROFILE_NONEXISTENT"),
                });
                return;
            }

            await ctx.send({
                embeds: [{
                    title: ":question: Are you sure you want to delete your profile?",
                    description: "You will still be able to create a new one using `/profile update`.",
                    color: 0xffff00,
                }],
                components: [{
                    type: ComponentTypes.ACTION_ROW,
                    components: ctx.createYesNoButtons(),
                }],
            });

            const canDelete = await ctx.askYesNo();

            if (canDelete) {
                await this.sosamba.db.deleteUserProfile(ctx.author.id);
                await ctx.send({
                    content: await t(ctx, "PROFILE_DELETED"),
                    embeds: [],
                    components: [],
                });
            } else {
                await ctx.send({
                    content: await t(ctx, "OP_CANCELLED"),
                    embeds: [],
                    components: [],
                });
            }

            break;
        }

        case "update": {
            const profile = await getUserProfile(ctx);

            if (timezone) {
                if (!this.isValidTz(timezone)) {
                    await ctx.send({
                        content: await t(ctx, "INVALID_TIMEZONE"),
                        flags: 64,
                    });

                    return;
                }
            }

            if (profile.fake) {
                await ctx.send({
                    embeds: [{
                        title: ":question: You don't have a profile yet.",
                        description: "Would you like to create one?",
                        color: 0xFFFF00,
                    }],
                    components: [{
                        type: ComponentTypes.ACTION_ROW,
                        components: ctx.createYesNoButtons(),
                    }],
                });

                const canCreate = await ctx.askYesNo();

                if (canCreate) {
                    if (timezone) profile.timezone = timezone;
                    if (locale) profile.locale = locale;

                    await this.sosamba.db.createUserProfile(profile.toEncryptedObject());
                    await ctx.send({
                        content: await t(ctx, "PROFILE_CREATED"),
                        embeds: [],
                        components: [],
                    });
                } else {
                    await ctx.send({
                        content: await t(ctx, "OP_CANCELLED"),
                        embeds: [],
                        components: [],
                    });
                }

                return;
            }

            if (timezone) profile.timezone = timezone;
            if (locale) profile.locale = locale;

            await setUserProfile(ctx, profile);
            await ctx.send(":ok_hand: Profile successfully updated.");
        }
        }
    }

    isValidTz(tz) {
        try {
            Intl.DateTimeFormat(void 0, { timeZone: tz });
            return true;
        } catch {
            return false;
        }
    }

    static getLocales(sosamba) {
        const terms = Object.keys(sosamba.localeManager.locales.get("en").terms);

        return sosamba.localeManager.locales.map(l => {
            const termsInForeign = terms.filter(term => Object.prototype.hasOwnProperty
                .call(l.terms, term)).length;
            return {
                name: `${l.terms.ENGLISH_LOCALE_NAME} (${l.terms.NATIVE_LOCALE_NAME}) \u2013 ${(termsInForeign / terms.length * 100).toFixed(2)}%`,
                value: l.id,
            };
        });
    }
}

export default ProfileCommand;
