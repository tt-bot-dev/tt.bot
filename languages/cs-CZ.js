// Říká se, že čeština je krásný, ale těžký jazyk.
// Tohle je pokus doplnit pády češtiny.
function getMessagesPlural(messages) {
    if (messages == 1) return "zpráva";
    if (messages >= 2 && messages <= 4) return "zprávy";
    return "zpráv";
}

function getDeletedPlural(messages) {
    if (messages == 1) return "Smazána";
    if (messages >= 2 && messages <= 4) return "Smazány";
    return "Smazáno";
}

function getBannedPlural(users) {
    if (users == 1) return "Zabanován";
    if (users >= 2 && users <= 4) return "Zabanováni";
    return "Zabanováno";
}

function getBannedUserPlural(users) {
    if (users == 1) return "uživatel";
    if (users >=2 && users <= 4) return "uživatelé";
    return "uživatelů";
}

function getMembersPlural(members) {
    if (members == 1) return "člen";
    if (members >= 2 && members <= 4) return "členové";
    return "členů";
}

function getItemsPlural(items) {
    if (items == 1) return "věc";
    if (items >= 2 && items <= 4) return "věci";
    return "věcí"
}


module.exports = {
    //#region commands
    //agree.js
    AGREE_FAULT:                                    owner => `Promiň, ale nemůžu ti dát roli. Prosím, řekni o tom vlastníkovi serveru (${bot.getTag(owner)})`,

    //agreesetup.js
    AGREE_SETUP_ALREADY:                            "Funkce souhlasu byla už nastavena na tomto serveru. Chceš ji vypnout?\nNapiš y nebo yes pro vypnutí. Jinak napiš n nebo no. Na odpověď máš 10 sekund.",
    AGREE_DISABLED:                                 "Hotovo! Funkce souhlasu je vypnuta.",
    AGREE_ROLE_QUERY:                               "Jdeme na to! Prosím, napiš sem jméno role, kterou chceš použít pro funkci souhlasu.",
    AGREE_SETUP:                                    prefix => `A je to! Když sem někdo napíše \`${prefix || config.prefix}agree\`, dám jim tuto roli.`,

    //ban.js
    BAN_DONE:                                       user => `:ok_hand: Uživatel ${bot.getTag(user)} byl zabanován.`,

    //clear.js
    CLEAR_DONE:                                     messages => `:ok_hand: ${getDeletedPlural(messages)} ${messages} ${getMessagesPlural(messages)}.`,

    // config.js
    GUILD_CONFIG:                                   (guild, items) => `\`\`\`\nKonfigurace serveru pro ${guild}\n${items.join("\n")}\`\`\`\nI když názvy nastavení jsou jednoduché, je možné, že vaše nastavení může způsobit neplechu.\nPokud chceš místo toho použít webovou verzi, jdi na ${config.webserverDisplay("/")}`,
    SETTING_UPDATED:                                (setting, value) => `Nastavení ${setting} nastaveno na ${value}`,
    SETTING_UNKNOWN:                                setting => `Neznámé nastavení ${setting}`,

    //delpunish.js
    CANNOT_UNSTRIKE:                                err => `Nemůžu odstranit varování z tohoto důvodu: ${err}`,

    //emoji.js
    IMAGE_GENERATING:                               "Generujeme obrázek. Tohle může chvíli trvat.",
    IMAGE_NONE:                                     "Nemůžu získat obrázek. Zkontroluj tvůj vstup a zkus to znovu.",
    IMAGE_AUTO_GENERATED:                           "Tenhle obrázek je automaticky generován.",
    IMAGE_CAVEATS:                                  `Nikdo ani nic není dokonalé, tohle jsou některé problémy, o kterých víme a s kterými se můžeš setkat.
- Tvoje emoji mohou být rychlejší nebo pomalejší v závislosti na frekvenci snímků (používáme 20ms odstup/50fps)
- Tvoje emoji mohou být ořezány.`,
    IMAGE_GENERATION_TIME:                          (sec, nsec) => `Generování tohoto obrázku trvalo ${sec} sekund a ${Math.floor(nsec / 1e6)} ms`,

    //farewell.js
    FAREWELL_UPDATED:                               (message, channelID) => `:ok_hand: Rozloučení nastaveno na \`${message}\`. Rozloučení bude posláno do <#${channelID}>.`, 
    FAREWELL_RESET:                                 "Rozloučení bylo resetováno.",

    //getavatar.js
    AVATAR_NOT_LOADING:                             avatar => `[Obrázek se nenačítá?](${avatar})`,


    //greet.js
    GREETING_UPDATED:                               (message, channelID) => `:ok_hand: Přivítání nastaveno na \`${message}\`. Přivítání bude posláno do <#${channelID}>.`,
    GREETING_RESET:                                 "Přivítání bylo resetováno.",

    //hackban.js
    HACKBANNED_USERS:                               users => `:ok_hand: ${getBannedPlural(users)} ${users} ${getBannedUserPlural(users)}.`,

    //help.js
    HELP_PUBLIC:                                    "Veřejné příkazy",
    HELP_OWNER:                                     "Příkazy pro vlastníka",
    HELP_MOD:                                       "Příkazy pro moderátory",
    HELP_ADMIN:                                     "Příkazy pro administrátory",
    HELP_FOR_COMMAND:                               command => `Nápověda pro příkaz ${command}`,
    HELP_ARGUMENTS:                                 "Argumenty",
    HELP_ALIASES:                                   "Aliasy",
    HELP_DESCRIPTION:                               "Popis",
    HELP_HOME:                                      (HelpMenu, permissions, msg) => `Vítej v tt.bot-ově nápovědě! Použij reakce pro přístup k nápovědě pro jednotlivé kategorie.\n:stop_button: Ukončit\n:house: Domácí stránka (tahle stránka)\n${HelpMenu.MESSAGES(msg).filter((_, idx) => permissions[idx]).join("\n")}`,
    HELP_NO_DESCRIPTION:                            "Žádný popis",
    HELP_REMINDER:                                  `Použij ${config.prefix}help <příkaz> pro informace o jednotlivých příkazech (momentálně v angličtině).`,

    //info.js
    INFO_STATS:                                     "Statistiky",
    INFO_STATS_TEXT:                                () => `Serverů: ${bot.guilds.size}\nUživatelů: ${bot.users.size}\nKanálů: ${Object.keys(bot.channelGuildMap).length}`,
    INFO_AUTHORS:                                   "Autoři a pomoc",
    INFO_OWNERS:                                    ownerStrings => `${ownerStrings.join("\n")}\n[Server podpory](https://discord.gg/pGN5dMq)\n[Repozitář na GitHubu](https://github.com/tttie/tttie-bot)`,
    INFO_VERSIONS:                                  "Verze:",
    INFO_UPTIME:                                    "Doba provozu:",

    //invite.js
    BOT_INVITE:                                     `Tady máš: <https://discordapp.com/oauth2/authorize?client_id=195506253806436353&scope=bot&permissions=-1\n\nPokud potřebuješ pomoct s používáním bota, přijď na náš server podpory, pozvánka je příkazu info.`,

    //inviteinspector.js
    CANNOT_GET_INVITE:                              "Nemůžu získat informace o pozvánce.",
    INVITE_ERR_FOOTER:                              "Jsi si jistý, že pozvánka je skutečná, a že nejsem odsud zabanován? Tohle nefunguje s pozvánkami do skupinových zpráv.",
    INV_CHANNEL_TYPE:                               "Typ kanálu",
    INV_CHANNEL_TYPE_VAL:                           (type, channelName) => `${type === 0 ? "Textový" : "Hlasový"} kanál s názvem ${bot.escapeMarkdown(channelName)}`,
    INV_GUILD_ID:                                   "ID serveru",
    INV_MEMBERS_VAL:                                (members, presences) =>  `${members} ${getMembersPlural(members)}, ${presences} online.`,
    INV_JOIN:                                       "Odkaz na server",
    INV_JOIN_LINK:                                  code =>  `Klikni na [tohle](https://discord.gg/${code})`,
    INV_INVITER:                                    user => `Pozvánka vytvořena uživatelem ${user}`,

    //kick.js
    KICK_DONE:                                      user => `:ok_hand: Uživatel ${bot.getTag(user)} byl vyhozen.`,

    //logging.js
    LOGGING_ALREADY_SETUP:                          "Funkce záznamů už byla nastavena na tomto serveru. Chceš ji vypnout?\nNapiš y nebo yes pro vypnutí. Jinak napiš n nebo no. Na odpověď máš 10 sekund.",
    LOGGING_DISABLED:                               "Hotovo! Funkce záznamů byla vypnuta!",
    LOGGING_SETUP:                                  "A je to! Když nějaká z událostí nastane, pošlu je sem.",

    //needsmorejpeg.js
    // No terms for this one.

    // phone.js
    // No terms for this command, the speakerphone feature won't be translated for now

    //ping.js
    PING_LATENCY:                                   ms => `Ping trval ${ms}ms.`,
    PING_DISCORD_LATENCY:                           ms => `Latence brány Discordu: ${ms}ms`,
    PONG:                                           ":ping_pong: Pong",

    //profile.js
    PROFILE_NONEXISTENT:                            "Ještě nemáš profil.",
    PROFILE_DELETED:                                "Tvůj profil je smazán.",
    PROFILE_CREATED:                                "OK. Tvůj profil je vytvořen.",
    INVALID_COLOR:                                  "Tahle barva není správná! Tenhle příkaz bere barvu v hex formátu (#1234AB)",
    BOT_PROFILE:                                    "Boti nemají profily.",
    PROFILE_SPECIFIC_NONEXISTENT:                   user => `Uživatel ${user} nemá profil.`,
    NO_PROFILE_FIELDS:                              "Žádná profilová políčka",
    FIELD_CREATED:                                  field => `Vytvořeno políčko s názvem \`${field}\`.`,
    FIELD_DELETED:                                  field => `Políčko \`${field}\` bylo smazáno.`,
    FIELD_NONEXISTENT:                              "Tohle políčko neexistuje!",
    INVALID_TIMEZONE:                               `Tohle časové pásmo není správné. Seznam možných časových pásem najdeš [zde](https://cdn.rawgit.com/TTtie/TTtie-Bot/master/tz.txt)`,
    INVALID_LOCALE:                                 locale => `Neplatný jazyk: \`${locale}\``,
    LOCALE_SET:                                     locale => `Tvůj jazyk byl nastaven na ${locale}.`,

    //serverinfo.js
    GUILD_VERIFICATION_NONE:                        "Žádná",
    GUILD_VERIFICATION_LOW:                         "Nízká (Vyžaduje ověřený email)",
    GUILD_VERIFICATION_MEDIUM:                      "Střední (Vyžaduje ověřený email a musí uplynout 5 minut od registrace na Discordu)",

        //These miss their tableflips because the tableflips are not translatable.
    GUILD_VERIFICATION_TABLEFLIP:                   "(Vyžaduje ověřený email, musí uplynout 5 minut od registrace na Discordu a musí uplynout 10 minut od příchodu na server)",
    GUILD_VERIFICATION_ULTRATABLEFLIP:              "(Vyžaduje ověřené telefonní číslo)",
    GUILD_VERIFICATION_LEVEL:                       "Úrověň ověření serveru",
    REQUIRES_ADMIN_MFA:                             "Vyžaduje 2FA pro administrativní úkony",
    MEMBER_COUNT:                                   members => `${members} ${getMembersPlural(members)}`,
    ROLE_COUNT:                                     roles => `${roles} rol${(roles <5 && roles >0) ? "e": "í"}`,
    EXPLICIT_FILTERING:                             "Filtrování explicitního obsahu",
    EXPLICIT_FILTERING_OFF:                         "Vypnuto",
    EXPLICIT_FILTERING_NOROLE:                      "Zapnuto pro uživatele bez rolí",
    EXPLICIT_FILTERING_ON:                          "Zapnuto",
    DEFAULT_NOTIFICATIONS:                          "Výchozí nastavení oznámení",
    ONLY_MENTIONS:                                  "Pouze @mentions",
    ALL_MESSAGES:                                   "Všechny zprávy",
    VOICE_REGION:                                   "Lokalita serveru",
    AFK_TIMEOUT:                                    "Časový limit AFK",
    AFK_MINUTES:                                    timeout => `${timeout / 60} minut${timeout / 60 == 1 ? "a" : ""}`,
    AFK_CHANNEL:                                    "Název AFK kanálu",

    //softban.js
    SOFTBAN_DONE:                                   user => `:ok_hand: Uživatel ${bot.getTag(user)} byl softbanován.`,

    //strike.js
    BOTS_NOT_STRIKABLE:                             "Neměl bys varovat boty. Je možné, že ublížíš jejich citům :(",
    YOU_GOT_STRIKED:                                "Vypadá, že jsi dostal(a) varování.",
    STRIKE_DETAILS:                                 (issuer, reason) => `Varování bylo uděleno ${issuer} z důvodu \`${reason || "Bez důvodu"}\`.`,
    PAY_ATTENTION:                                  "Dávej si pozor na to, co děláš!",

    //strikes.js
    TOO_MUCH_STRIKES:                               "Uživatel má příliš mnoho varování na to, abych je mohl ukázat v embedu. Místo toho, tady máš textový soubor:",
    STRIKE_OVERVIEW:                                user => `Tady jsou varování uživatele ${user}`,

    //tags.js
    TAG_CREATED:                                    tag => `Vytvořen tag s názvem \`${tag}\`.`,
    TAG_EXISTS:                                     "Tenhle tag už existuje!",
    TAG_DOESNTEXIST:                                "Tenhle tag neexistuje.",
    TAG_NOTOWNER:                                   "Nevlastníš tenhle tag.",
    TAG_DELETED:                                    tag => `Smazán tag s názvem \`${tag}\`.`,
    TAG_UPDATED:                                    tag => `Upraven tag s názvem \`${tag}\`.`,
    TAG_DISPLAY:                                    tag => `Tag ${tag}`,

    //talk.js
    QUERY_TOO_LONG:                                 "Tvůj dotaz je příliš dlouhý.",
    CANT_TELL:                                      "Nevím jak na toto odpovědět :thinking:",

    //timefor.js
    NO_TZ:                                          "Tento uživatel si zatím nenastavil časové pásmo.",
    TIME_FOR:                                       (time, user) => `Je ${time} pro uživatele ${user}.`,

    //uinfo.js
    PLAYING:                                        "Hraje",
    STREAMING:                                      "Streamuje",
    LISTENING_TO:                                   "Poslouchá",
    ONLINE:                                         "Online",
    IDLE:                                           "Nečinný",
    DND:                                            "Nerušit",
    OFFLINE:                                        "Neviditelný/offline",
    USER_INFO:                                      (nickstr, limited = false) => `${limited? "Omezené i" : "I"}nformace pro uživatele ${nickstr}`,
    PLAYING_NONE:                                   "Nic",
    SPACE_UNIVERSE:                                 "si s vesmírem plných mezer.\nHodně štěstí, nalezl(a) jsi easter egg :eyes:",
    CURRENT_VOICE:                                  "Aktuální hlasový kanál",
    NO_CURRENT_VOICE:                               "Žádný",
    JOINED_ON:                                      "Připojen(a) na serveru:",

    //#endregion commands

    //#region events
    // It is possible that the server owner has a profile.
    HI_I_AM_BOT:                                    `:wave: Ahoj!`,
    SOME_THINGS_SAID:                               () => `Moje jméno je ${bot.user.username} a jsem instance tt.bot-a, multifunkčního a zábavného bota pro Discord. Cítil jsem potřebu popsat ti, kdo jsem.`,
    GETTING_STARTED:                                ":floppy_disk: Začínáme",
    GETTING_STARTED_DESCRIPTION:                    `Nepotřebuješ nastavovat tt.bot-a, aby sis užil(a) jeho základní funkce! Ale k používání příkazů pro moderátory, ty (nebo kdokoliv s oprávněním Administrátor) musí použít příkaz \`${config.prefix}config\`, aby vytvořil konfiguraci serveru. A to je v podstatě všechno! Dej svým moderátorům roli "tt.bot mod" a můžou začít moderovat! Nebo nastav nastavení modRole na jméno tvé role pro moderátory.`,
    EVERYTHING_ELSE:                                ":books: Všechno ostatní",
    EVERYTHING_ELSE_DESCRIPTION:                    "Pokud potřebuješ pomoct (nebo si s námi jen popovídat), přijď na náš server podpory; pozvánku najdeš v příkazu info.",
    THANKS_FOR_CHOOSING:                            "Děkujeme, že sis vybral(a) tt.bot-a!",
    WISHING_GOOD_LUCK:                              "*Přeju ti hodně štěstí s tvým serverem-*",
    //#endregion events

    //#region queries
    ITEM_NOT_FOUND:                                 (query, notfound) => `Nemůžu najít ${query}. Jsi si jistý, že existuje? ${notfound}`,
    MULTIPLE_ITEMS_FOUND:                           "Více věcí nalezeno!",
    MULTIPLE_ITEMS_DESCRIPTION:                     (items, list) => `Našel jsem ${items} ${getItemsPlural(items)}, ukazuji nejvíce 5 z nich.
${list}
Vyber jednu reagováním číslem vedle věci, kterou chceš vybrat.
Jinak, vyber ❌ pro zrušení.
Dotaz expiruje za 5 minut.`,

    //#endregion queries

    // There is going to be webserver translations soon, but currently cannot figure it out.


    // Reaction menu
    REACTION_MENU_EXIT_MANUAL:                      "Opustil(a) jsi menu.",
    REACTION_MENU_EXIT_MESSAGE_DELETE:              "Menu ukončeno, protože zpráva byla smazána.",
    REACTION_MENU_EXIT_CHANNEL_DELETE:              "Menu ukončeno, protože kanál byl smazán.",
    REACTION_MENU_NO_AUTOREMOVE:                    "Chyba: Nemůžu odstranit tvoji reakci protože mi chybí oprávnění \"Spravovat zprávy\".\nPokud mi ho někdo dá, odstraním tvoji reakci pro tvoje pohodlí.",

    // General
    NONE:                                           "Žádné",
    MEMBERS:                                        "Členové",
    OWNER:                                          "Vlastník",
    ROLES:                                          "Role",
    STATUS:                                         "Stav",
    REASON:                                         "Důvod",
    OP_CANCELLED:                                   "Operace zrušena.",
    COMMAND_ERROR:                                  "Promiň, ale nepochopil jsem tvoji informaci. Prosím zkontroluj tvůj vstup a znovu spusť příkaz.",
    ARGS_MISSING:                                   `Chybí ti vyžadované argumenty.`,
    ROLE_HIERARCHY_ERROR:                           `Nemůžeš tohle udělat na tohohle uživatele.`,
    ERROR:                                          err => `Jejda. Zkusil jsem splnit tvůj příkaz, ale mám problém. Prosím, dej tohle mým vývojářům.\n\`\`\`js\nError:\n${err}\n\`\`\``,
    OOPS:                                           `Jejda.. Mám menší problém.`,
    MISSING_PERMISSIONS:                            `Nemám oprávnění na provedení akce na tomto serveru.`,
    CREATED_ON:                                     "Vytvořen",
    YES:                                            "Ano",
    NO:                                             "Ne",
    TOOLONG:                                        "Příliš dlouhé na ukázání, promiň :(",

    // Locale info
    NATIVE_LOCALE_NAME:                             "Čeština",
    ENGLISH_LOCALE_NAME:                            "Czech"
};