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

import { Eris } from "sosamba";
const { User, Member } = Eris;

/**
 * @param {User | Member} userOrMember The user to DM
 * @param {Parameters<import("eris").PrivateChannel["createMessage"]>} args The message to send
 */
export default async (userOrMember, ...args) => {
    let dmChannel;
    if (userOrMember instanceof User) {
        dmChannel = await userOrMember.getDMChannel();
    } else if (userOrMember instanceof Member) {
        dmChannel = await userOrMember.user.getDMChannel();
    }
    return dmChannel.createMessage(...args);
};