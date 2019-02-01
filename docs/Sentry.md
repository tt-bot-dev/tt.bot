

# sentry.io integration
tt.bot supports the sentry.io integration. Just fill out the config.js(on) `sentry` property with this object:
```js
{
    "enabled": true,
    "url": "https://YOURCLIENTID@sentry.io/PROJECTID",
    "options": {
        "some": "properties for sentry. Some are overridden by the bot core itself, for easier debugging; they're listed below"
    }
}
```

# Non-overridable properties
These were made for us to realize where this happened; until we realized we have only 10k errors/month.
This is the object so you can see. You can always modify these by modifing [this file](util/sentry.js)
```js
{
    name: `ttbot`,
    release: require("../package.json").version,
    captureUnhandledRejections: true,
    stacktrace: true,
    dataCallback: r => {
        r.user.id = bot.user ? bot.user.id : "none";
        return r;
    },
    parseUser: ["id"]
}
```