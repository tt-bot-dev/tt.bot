<!--
Copyright (C) 2020 tt.bot dev team
 
This file is part of tt.bot.
 
tt.bot is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
 
tt.bot is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.
 
You should have received a copy of the GNU Affero General Public License
along with tt.bot.  If not, see <http://www.gnu.org/licenses/>.
-->
# ttMsg
ttMsg is a simple but not feature-rich text tagging system for messages. These work in tags, welcome and farewell messages.

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