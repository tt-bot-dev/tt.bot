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