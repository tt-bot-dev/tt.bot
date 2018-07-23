module.exports = {
    //#region commands
    //agree.js
    AGREE_FAULT:                                    owner => `Sorry, but I'm not able to give you the role. Please tell the server owner (${bot.getTag(owner)}) about this.`,

    //agreesetup.js
    AGREE_SETUP_ALREADY:                            "The agreement feature was already set up on this server. Do you want to disable it?\nType y or yes for disabling it. n or no otherwise. To respond, you have 10 seconds.",
    AGREE_DISABLED:                                 "Done! The agree feature is now disabled.",
    AGREE_ROLE_QUERY:                               "So, here we go! Please type your search query to choose the role you want to set up the agreement feature.",
    AGREE_SETUP:                                    prefix => `The setup is done! Now, when somebody types \`${prefix || config.prefix}agree\` here, I'll give them the role.`,

    //ban.js
    BAN_DONE:                                       user => `:ok_hand: Banned ${bot.getTag(user)}.`,

    //clear.js
    CLEAR_DONE:                                     messages => `:ok_hand: Deleted ${messages} messages.`,

    // config.js
    GUILD_CONFIG:                                   (guild, items) => `\`\`\`\nServer configuration for ${guild}\n${items.join("\n")}\`\`\`\nEven though the config names are selfexplanatory, it is possible that your settings might bork the configuration.\nIf you want to use the web version instead, go to ${config.webserverDisplay("/")}`,
    SETTING_UPDATED:                                (setting, value) => `Updated ${setting} to ${value}`,
    SETTING_UNKNOWN:                                setting => `Unknown setting ${setting}`,

    //delpunish.js
    CANNOT_UNSTRIKE:                                err => `Cannot remove the strike for this reason: ${err}`,

    //emoji.js
    IMAGE_GENERATING:                               "We're generating the image. Wait and prepare a cup of coffee. This may take a while.",
    IMAGE_NONE:                                     "Could not get an image. Please validate your input and try again.",
    IMAGE_AUTO_GENERATED:                           "This image is automatically generated.",
    IMAGE_CAVEATS:                                  `Nobody and also nothing isn't perfect, these are current caveats that you may experience and we know about.
- Your emoji may be fast/slow depending on the frame rate (we use 20ms delay/50fps)
- Your emoji may get cut off.`,
    IMAGE_GENERATION_TIME:                          (sec, nsec) => `Generating this image took ${sec} seconds and ${Math.floor(nsec / 1e6)} ms`,

    //farewell.js
    FAREWELL_UPDATED:                               (message, channelID) => `:ok_hand: Updated the leave message to \`${message}\`. It will be sent into <#${channelID}>.`, 
    FAREWELL_RESET:                                 "Reset the farewells.",

    //getavatar.js
    AVATAR_NOT_LOADING:                             avatar => `[Image not loading?](${avatar})`,


    //greet.js
    GREETING_UPDATED:                               (message, channelID) => `:ok_hand: Updated the welcome message to \`${message}\`. It will be sent into <#${channelID}>.`,
    GREETING_RESET:                                 "Reset the greetings.",

    //hackban.js
    HACKBANNED_USERS:                               users => `:ok_hand: Banned ${users} user${users !== 1 ? "s": ""} .`,

    //help.js
    HELP_PUBLIC:                                    "Public commands",
    HELP_OWNER:                                     "Owner commands",
    HELP_MOD:                                       "Moderator commands",
    HELP_ADMIN:                                     "Administrator commands",
    HELP_FOR_COMMAND:                               command => `Help for ${command} command`,
    HELP_ARGUMENTS:                                 "Arguments",
    HELP_ALIASES:                                   "Aliases",
    HELP_DESCRIPTION:                               "Description",
    HELP_HOME:                                      (HelpMenu, permissions, msg) => `Welcome to tt.bot's help! Please use reactions to access the help for the command categories.\n:stop_button: Stop\n:house: Home (this page)\n${HelpMenu.MESSAGES(msg).filter((_, idx) => permissions[idx]).join("\n")}`,
    HELP_NO_DESCRIPTION:                            "No description",
    HELP_REMINDER:                                  `Use ${config.prefix}help <command> to see more information about it.`,

    //info.js
    INFO_STATS:                                     "Stats",
    INFO_STATS_TEXT:                                () => `Guilds: ${bot.guilds.size}\nCached users: ${bot.users.size}\nChannels: ${Object.keys(bot.channelGuildMap).length}`,
    INFO_AUTHORS:                                   "Author(s) and help",
    INFO_OWNERS:                                    ownerStrings => `${ownerStrings.join("\n")}\n[Support server](https://discord.gg/pGN5dMq)\n[GitHub repository](https://github.com/tttie/tttie-bot)`,
    INFO_VERSIONS:                                  "Versions:",
    INFO_UPTIME:                                    "Uptime:",

    //invite.js
    BOT_INVITE:                                     `Here you go! <https://discordapp.com/oauth2/authorize?client_id=195506253806436353&scope=bot&permissions=-1\n\nIf you need help using the bot, come to our support server, invite is in info command.`,

    //inviteinspector.js
    CANNOT_GET_INVITE:                              "I cannot get the information on the invite.",
    INVITE_ERR_FOOTER:                              "Are you sure the invite exists and that I'm not banned from there? This also doesn't work with group DMs.",
    INV_CHANNEL_TYPE:                               "Channel type",
    INV_CHANNEL_TYPE_VAL:                           (type, channelName) => `${type === 0 ? "Text" : "Voice"} channel named ${bot.escapeMarkdown(channelName)}`,
    INV_GUILD_ID:                                   "Guild ID",
    INV_MEMBERS_VAL:                                (members, presences) =>  `${members} members, ${presences} online.`,
    INV_JOIN:                                       "Join",
    INV_JOIN_LINK:                                  code =>  `Click [this](https://discord.gg/${code})`,
    INV_INVITER:                                    user => `Invited by ${user}`,

    //kick.js
    KICK_DONE:                                      user => `:ok_hand: Kicked ${bot.getTag(user)}.`,

    //logging.js
    LOGGING_ALREADY_SETUP:                          "The logging feature was already set up on this server. Do you want to disable it?\nType y or yes for disabling it. n or no otherwise. To respond, you have 10 seconds.",
    LOGGING_DISABLED:                               "Done! The logging feature is now disabled.",
    LOGGING_SETUP:                                  "The setup is done! Now, when one of the specified events trigger, I'll send them here.",

    //needsmorejpeg.js
    // No terms for this one.

    // phone.js
    // No terms for this command, the speakerphone feature won't be translated for now

    //ping.js
    PING_LATENCY:                                   ms => `It took ${ms}ms to ping.`,
    PING_DISCORD_LATENCY:                           ms => `Discord gateway latency: ${ms}ms`,
    PONG:                                           ":ping_pong: Pong",

    //profile.js
    PROFILE_NONEXISTENT:                            "You haven't created a profile yet!",
    PROFILE_DELETED:                                "Deleted your profile.",
    PROFILE_CREATED:                                "OK. Your profile is created.",
    INVALID_COLOR:                                  "This color isn't valid! This command accepts a hex color (#1234AB)",
    BOT_PROFILE:                                    "Bots don't have profiles.",
    PROFILE_SPECIFIC_NONEXISTENT:                   user => `${user} hasn't got a profile.`,
    NO_PROFILE_FIELDS:                              "No profile fields",
    FIELD_CREATED:                                  field => `Made a field with name of \`${field}\`.`,
    FIELD_DELETED:                                  field => `Deleted the field \`${field}\``,
    FIELD_NONEXISTENT:                              "That field doesn't exist!",
    INVALID_TIMEZONE:                               `This timezone is invalid. You can find a list of possible timezones [here](https://cdn.rawgit.com/TTtie/TTtie-Bot/master/tz.txt)`,
    INVALID_LOCALE:                                 locale => `Invalid locale \`${locale}\``,
    LOCALE_SET:                                     locale => `Set your locale to ${locale}.`,

    //serverinfo.js
    GUILD_VERIFICATION_NONE:                        "None",
    GUILD_VERIFICATION_LOW:                         "Low (Requires a verified email)",
    GUILD_VERIFICATION_MEDIUM:                      "Medium (Requires a verified email and being registered on Discord for at least 5 minutes)",

        //These miss their tableflips because the tableflips are not translatable.
    GUILD_VERIFICATION_TABLEFLIP:                   "(Requires a verified email, being registered on Discord for at least 5 minutes and being on the server for at least 10 minutes)",
    GUILD_VERIFICATION_ULTRATABLEFLIP:              "(Requires a verified phone number)",
    GUILD_VERIFICATION_LEVEL:                       "Guild verification",
    REQUIRES_ADMIN_MFA:                             "Requires admin 2FA",
    MEMBER_COUNT:                                   members => `${members} member${members !== 1 ? "s" : ""}`,
    ROLE_COUNT:                                     roles => `${roles} role${roles !== 1 ? "s" : ""}`,
    EXPLICIT_FILTERING:                             "Explicit content filtering",
    EXPLICIT_FILTERING_OFF:                         "Off",
    EXPLICIT_FILTERING_NOROLE:                      "On for people without any role",
    EXPLICIT_FILTERING_ON:                          "On",
    DEFAULT_NOTIFICATIONS:                          "Default notification setting",
    ONLY_MENTIONS:                                  "Only @mentions",
    ALL_MESSAGES:                                   "All messages",
    VOICE_REGION:                                   "Voice region",
    AFK_TIMEOUT:                                    "AFK timeout",
    AFK_MINUTES:                                    timeout => `${timeout / 60} minutes`,
    AFK_CHANNEL:                                    "AFK channel name",

    //softban.js
    SOFTBAN_DONE:                                   user => `:ok_hand: Softbanned ${bot.getTag(user)}.`,

    //strike.js
    BOTS_NOT_STRIKABLE:                             "You shouldn't strike the bots. You might hurt their feelings :(",
    YOU_GOT_STRIKED:                                "It seems like you've got striked.",
    STRIKE_DETAILS:                                 (issuer, reason) => `The strike was issued by ${issuer} for reason \`${reason || "No reason"}\`.`,
    PAY_ATTENTION:                                  "Pay attention on what you're doing!",

    //strikes.js
    TOO_MUCH_STRIKES:                               "The user has too much strikes to display in an embed. Here's a text file instead:",
    STRIKE_OVERVIEW:                                user => `Here are ${user}'s strikes`,

    //tags.js
    TAG_CREATED:                                    tag => `Created a tag with a name of \`${tag}\`.`,
    TAG_EXISTS:                                     "This tag already exists!",
    TAG_DOESNTEXIST:                                "This tag doesn't exist.",
    TAG_NOTOWNER:                                   "You don't own that tag.",
    TAG_DELETED:                                    tag => `Deleted a tag with a name of \`${tag}\`.`,
    TAG_UPDATED:                                    tag => `Updated a tag with a name of \`${tag}\`.`,
    TAG_DISPLAY:                                    tag => `Tag ${tag}`,

    //talk.js
    QUERY_TOO_LONG:                                 "Your query is too long.",
    CANT_TELL:                                      "I don't know how to respond to that :/",

    //timefor.js
    NO_TZ:                                          "This user hasn't set any timezone yet.",
    TIME_FOR:                                       (time, user) => `It's ${time} for ${user}.`,

    //uinfo.js
    PLAYING:                                        "Playing",
    STREAMING:                                      "Streaming",
    LISTENING_TO:                                   "Listening to",
    ONLINE:                                         "Online",
    IDLE:                                           "Idle",
    DND:                                            "Do not disturb",
    OFFLINE:                                        "Invisible/offline",
    USER_INFO:                                      (nickstr, limited = false) => `${limited? "Limited i" : "I"}nfo for ${nickstr}`,
    PLAYING_NONE:                                   "Nothing",
    SPACE_UNIVERSE:                                 "with an universe of spaces.\nGood luck, you found an easter egg :eyes:",
    CURRENT_VOICE:                                  "Current voice channel",
    JOINED_ON:                                      "Joined on",
    NO_CURRENT_VOICE:                               "None",

    //#endregion commands

    //#region events
    // It is possible that the server owner has a profile.
    HI_I_AM_BOT:                                    `:wave: Hi there!`,
    SOME_THINGS_SAID:                               () => `My name is ${bot.user.username} and I'm an instance of tt.bot, a multifunctional and fun Discord bot. I felt there is a need of describe myself to you.`,
    GETTING_STARTED:                                ":floppy_disk: Getting started",
    GETTING_STARTED_DESCRIPTION:                    `You don't require any setup for tt.bot to work with basic features! However, to use some moderation commands, you (or anyone with Administrator permission) have to use the \`${config.prefix}config\` command to create the configuration. And that's basically it! Give your staff the "tt.bot mod" role and they can start moderating! Or set the modRole setting to whatever your role name is.`,
    EVERYTHING_ELSE:                                ":books: Everything else",
    EVERYTHING_ELSE_DESCRIPTION:                    "If you need help (or just want to hang out with us), feel free to come to our support server; the invite is in the info command.",
    THANKS_FOR_CHOOSING:                            "Thanks for choosing tt.bot!",
    WISHING_GOOD_LUCK:                              "*I wish you good luck with your server-*",
    //#endregion events

    //#region queries
    ITEM_NOT_FOUND:                                 (query, notfound) => `We cannot find ${query}. Are you sure it exists? ${notfound}`,
    MULTIPLE_ITEMS_FOUND:                           "Multiple items found!",
    MULTIPLE_ITEMS_DESCRIPTION:                     (items, list) => `I've found ${items} items, displaying 5 of them at most.
${list}
Choose one from the users by reacting with the number next to the username.
Else, react with ❌ to cancel.
Query will automatically expire in 5 minutes.`,

    //#endregion queries

    // There is going to be webserver translations soon, but currently cannot figure it out.


    // Reaction menu
    REACTION_MENU_EXIT_MANUAL:                      "You have exited the menu.",
    REACTION_MENU_EXIT_MESSAGE_DELETE:              "Exited the menu because the message was deleted.",
    REACTION_MENU_EXIT_CHANNEL_DELETE:              "Exited the menu because the channel was deleted.",
    REACTION_MENU_NO_AUTOREMOVE:                    "Error: Cannot remove your reaction because I'm very likely lacking the Manage Messages permission.\nIf you give it to me, I'll remove your reaction for your convenience.",

    // General
    NONE:                                           "None",
    MEMBERS:                                        "Members",
    OWNER:                                          "Owner",
    ROLES:                                          "Roles",
    STATUS:                                         "Status",
    REASON:                                         "Reason",
    OP_CANCELLED:                                   "Operation cancelled.",
    COMMAND_ERROR:                                  "Sorry, but I didn't get this right. Please double check the input and rerun the command.",
    ARGS_MISSING:                                   `You miss some required arguments. :thinking:`,
    ROLE_HIERARCHY_ERROR:                           `You can't do this on that user.`,
    ERROR:                                          err => `Oops. I have tried completing your command, but I ran into an error. Please share this with my developers.\n\`\`\`js\nError:\n${err}\n\`\`\``,
    OOPS:                                           `Oops.. I have a little problem.`,
    MISSING_PERMISSIONS:                            `I'm missing the permission to do this in your server.`,
    CREATED_ON:                                     "Created on",
    YES:                                            "Yes",
    NO:                                             "No",
    TOOLONG:                                        "Too long to show, sorry :(",
    
    NATIVE_LOCALE_NAME:                             "English",
    ENGLISH_LOCALE_NAME:                            "English"
};