# ttMsg
ttMsg exposes some parts of data to the users.

This currently works with:
- Welcome messages
- Farewell messages
- Tags
# Documentation
## User related ttMsg tags
- `{u.mention}` - Mentions the user.
- `{u.name}` - Returns the user's username.
- `{u.discrim}` - Returns user's 4digit number.
- `{u.id}` - Returns user's ID.
- `{u.tag}` - A convenience shortcut for `{u.name}#{u.discrim}`.
## Server related ttMsg tags
- `{g.name}` - Returns the server name.
- `{g.id}` - Returns the server ID.
- `{g.channels}` - Channel count of the server.
- `{g.members}` - Member count of the server.