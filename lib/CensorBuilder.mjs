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

import config from "../config.js";

class CensorBuilder {
    constructor(values, bot) {
        if (values && !Array.isArray(values)) throw new TypeError("The values parameter is not an array");
        this.bot = bot;
        this.values = values || [];
        this.checkValues();
    }
    checkValues() {
        if (this.values.length === 0) {
            let values = [
                this.bot.token,
                config.token,
                config.topGGKey,
                config.botsGGKey,
                config.clientSecret
            ];

            this.values = values;
        }
        this.values = this.values.filter(c => c);
    }
    build() {
        return new RegExp(this.values.join("|"), "g");
    }
}

export default CensorBuilder;