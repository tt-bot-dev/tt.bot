/**
 * Copyright (C) 2021 tt.bot dev team
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

"use strict";
const Sandbox = require("./Sandbox");
const { VM, VMScript } = require("vm2");

module.exports = (ctx, bot, code, { id, name, data, flags }, commandData) => {
    const vm = new VM({
        sandbox: Sandbox(ctx, bot, { id, name, data, flags }, commandData),
        timeout: 10000,
        wasm: false
    });
    const script = new VMScript(code, `tt.bot/${id}/extension.js`);
    try {
        vm.run(script);
        return { error: false };
    } catch (error) {
        const stack = error.stack.split("\n");
        const errorObject = new class ExtensionError extends Error {
            constructor() {
                super();
                this.message = error.message;
                this.name = error.name;
                this.stack = stack.slice(0, stack.length - 5).join("\n");
            }
        };
        return { 
            error: errorObject
        };
    }
};