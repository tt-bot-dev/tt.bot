# ttMsg
ttMsg exposes some parts of data to the users.

This currently works with:
- Welcome messages
- Farewell messages
- Tags
# Documentation
## User related ttMsg tags
- `{u.mention}` - Mentions the user.
- `{u.name}` - the user's username.
- `{u.discrim}` - user's discriminator (4digit number).
- `{u.id}` - Returns user's ID.
- `{u.tag}` - A convenience shortcut for `{u.name}#{u.discrim}`.
## Server related ttMsg tags
- `{g.name}` - the server name.
- `{g.id}` - the server ID.
- `{g.channels}` - Channel count of the server.
- `{g.members}` - Member count of the server (prior to v4, how much members in the server the bot knows).