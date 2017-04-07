# tt.bot
tt.bot is a bot with aim for moderation and fun, made in [Eris](https://github.com/abalabahaha/eris).<br>
This bot uses some pieces of code from [blargbot](https://github.com/ratismal/blargbot), so here come the credits.

# Features
<span style="color:red">The bot is being rewritten, so it lacks features it had before.</span>
- Cross-server telephony
- Getting user info and their avatar

# Database
The database is RethinkDB. It is a required backend that needs to mod commands to work.

# How to set up
1. Rename `exampleconfig.json` to `config.json`
2. Edit token, oid, prefix and optional, but if you need, dbotskey properties.
3. Run `run.js`

# Creating events/commands
Refer to [EVENTS.md](./EVENTS.md) or [COMMANDS.md](./COMMANDS.md).

# Running the bot
The bot uses asynchronous methods, so the run command is
`node --harmony run.js`