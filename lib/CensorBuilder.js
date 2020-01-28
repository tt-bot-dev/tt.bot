"use strict";
const config = require("../config");
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
module.exports = CensorBuilder;