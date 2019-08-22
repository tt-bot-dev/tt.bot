"use strict";
class CensorBuilder {
    constructor(values) {
        if (values && !Array.isArray(values)) throw new TypeError("The values parameter is not an array");
        this.values = values || [];
        this.checkValues();
    }
    checkValues() {
        if (this.values.length === 0) {
            let values = [
                bot.token,
                config.token,
                config.dbotskey,
                config.dbots2key,
                config.clientSecret
            ];
            if (config.connectionOpts) {
                if (config.connectionOpts.password) values.push(config.connectionOpts.password);
            }

            this.values = values;
        }
        this.values = this.values.filter(c => c);
    }
    build() {
        return new RegExp(this.values.join("|"), "g");
    }
}
module.exports = CensorBuilder;