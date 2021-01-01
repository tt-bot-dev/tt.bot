<!--
Copyright (C) 2021 tt.bot dev team
 
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
These might not be the most correct. You might want to look at `availableTypes` property at `/logging/index.js`.  
The events should be separated with a semicolon (";")
- `all` - Everything listed below.
- `messageUpdate` - Message edits
- `messageDelete` - Message deletions (cached messages)
- `messageBulkDelete` - Message bulk deletions (deletions of multiple messages at once)
- `messageUnknownDelete` - Message deletions (uncached messages)
- `guildBan` - Bans on the server
- `guildUnban` - Unbans on the server

For the last two, tt.bot can display the ban/unban issuers and reasons for bans.  
If you want this, go ahead and give it the `View Audit Log` permission.