# tt.bot 
[![Discord](https://discordapp.com/api/guilds/195865382039453697/widget.png?style=shield](https://discord.gg/pGN5dMq) [![Add me!](https://img.shields.io/badge/tt.bot-add%20to%20your%20server-brightgreen.svg?style=flat-square)](https://discordapp.com/oauth2/authorize?scope=bot&client_id=195506253806436353&permissions=-1&redirect_uri=https://tttie.ga/close.php&response_type=code)
[![Build Status](https://travis-ci.org/tt-bot-dev/tt.bot.svg?branch=master)](https://travis-ci.org/tt-bot-dev/tt.bot)

tt.bot is a bot with aim for moderation and fun, made in JavaScript using [Node.js](https://nodejs.org) and [Eris](https://github.com/abalabahaha/eris) library.<br>
This bot uses (and probably used) some pieces of code from [blargbot](https://github.com/ratismal/blargbot).

# Features
- Cross-server telephony
- Getting user info and their avatar
- Basic moderation
- Welcome and farewell messages
- Rerouting your command input into direct messages
- Emoji to picture 
- Many more commands that I am lazy to list
- Logging deleted messages

# How to selfhost
Go [here](https://github.com/TTtie/TTtie-Bot/wiki/Selfhosting)

# Creating events/commands
Refer to [EVENTS.md](./EVENTS.md) or [COMMANDS.md](./COMMANDS.md).

## sentry.io integration
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