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

import { readFile } from "fs/promises";
import { join } from "path";
import { fileURLToPath } from "url";

/**
 * @type {import("../package.json")}
 */
export default JSON.parse(await readFile(join(fileURLToPath(import.meta.url), "../../package.json"), { encoding: "utf-8" }));

/**
 * @type {import("sosamba/package.json")}
 */
export const sosambaPackage = JSON.parse(await readFile(join(fileURLToPath(import.meta.url), "../../node_modules/sosamba/package.json"), { encoding: "utf-8" }));
