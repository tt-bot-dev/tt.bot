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

import { request } from "undici";
import config from "../config.js";

/**
 * @type {request}
 */
const req = async (...args) => {
    const c = await request(...args);
    if (c.statusCode !== 200) {
        throw new Error("Posting the gist has failed");
    }
    return c;
};

export default (fileName, content, description = "", publicGist = false) =>
    config.gistKey ? req("https://api.github.com/gists", {
        headers: {
            authorization: `Token ${config.gistKey}`
        },
        body: JSON.stringify({
            description,
            public: publicGist,
            files: {
                [fileName]: {
                    content
                }
            }
        }),
        method: "POST"
    }).then(r => r.body.json()) : Promise.reject(new Error("No gist key supplied"));