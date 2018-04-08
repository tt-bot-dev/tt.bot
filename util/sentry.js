const Raven = require("raven");
class Sentry {
    constructor() {
        if (!config.sentry) {
            this.enabled = false;
            this.url = null;
            this.config = {};
            return false;
        }
        this.enabled = config.sentry.enabled;
        this.url = config.sentry.url;
        
        if (this.enabled) {
            this.config = Object.assign(config.sentry.config || {}, {
                name: `ttbot`,
                release: require("../package.json").version,
                captureUnhandledRejections: true,
                stacktrace: true,
                dataCallback: r => {
                    r.user.id = bot.user ? bot.user.id : "none";
                    return r;
                },
                parseUser: ["id"]
            });
            this.raven = Raven.config(this.url, this.config);
            this.raven.disableConsoleAlerts();
        }
    }

    enable() {
        if (!this.enabled) return false;
        return this.raven.install();
    }
}
module.exports = Sentry;