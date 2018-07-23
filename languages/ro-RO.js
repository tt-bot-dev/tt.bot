module.exports = {
    //#region commands
    //agree.js
    AGREE_FAULT:                                    owner => `Scuze, dar n-am posibilitatea să-ți dau rolul specific. Luați-vă în legătură cu deținătorul serverului (${bot.getTag(owner)}) despre aceasta.`,

    //agreesetup.js
    AGREE_SETUP_ALREADY:                            "Caracteristica de acordare a fost deja setată in acest server. Doriți să o dezactivați?\nScrieți y sau yes pentru a o dezactiva. n sau no pentru a anula dezactivarea. Aveți 10 secunde la dispoziție pentru a răspunde.",
    AGREE_DISABLED:                                 "Gata! Caracteristica de acordare a fost dezactivată cu succes.",
    AGREE_ROLE_QUERY:                               "Hai sa începem! Tastați vă rog rolul in care doriți să setați caracteristica de acordare.",
    AGREE_SETUP:                                    prefix => `Setarea este gata! De acum, când cineva va scrie \`${prefix || config.prefix}agree\` aici, le dau rolul.`,

    //ban.js
    BAN_DONE:                                       user => `:ok_hand: Accesul la server a utilizatorului ${bot.getTag(user)} i-a fost interzisă.`,

    //clear.js
    CLEAR_DONE:                                     messages => `:ok_hand: ${messages} (de) mesaje au fost șterse.`,

    // config.js
    GUILD_CONFIG:                                   (guild, items) => `\`\`\`\nConfigurația serverului pentru ${guild}\n${items.join("\n")}\`\`\`\nChiar daca numele configurațiilor sunt auto-explicative, este posibil ca setătiile dvs. să rupă configurația actuală.\nDacă dotiți să folosiți versiunea de web, duceți-vă în ${config.webserverDisplay("/")}`,
    SETTING_UPDATED:                                (setting, value) => `Setarea ${setting} a fost actualizată în ${value}`,
    SETTING_UNKNOWN:                                setting => `Setare necunoscută, ${setting}`,

    //delpunish.js
    CANNOT_UNSTRIKE:                                err => `Nu pot să șterg strike-ul respectiv din cauza acestui motiv: ${err}`,

    //emoji.js
    IMAGE_GENERATING:                               "Generăm imaginea. Așteptati și pregătițiva o cană de cafea caldă. Procesul poate dura ceva timp.",
    IMAGE_NONE:                                     "N-am putut să iau orice imagine. Te rugăm să verificați input-ul și încercați din nou.",
    IMAGE_AUTO_GENERATED:                           "Aceasta imagine a fost generată automat.",
    IMAGE_CAVEATS:                                  `Nimeni și nimic nu e perfect, acelea sunt avertismentele actuale și știm deja de ele.
- Procesarea emojiului dvs. poate fi rapidă sau lentă în funcție de cadre (folosim 20ms răspuns/50 de cadre)
- Emoji-ul dvs. ar putea fi decupat.`,
    IMAGE_GENERATION_TIME:                          (sec, nsec) => `Generarea acestei imagini a durat ${sec} (de) secunde și ${Math.floor(nsec / 1e6)} ms`,

    //farewell.js
    FAREWELL_UPDATED:                               (message, channelID) => `:ok_hand: Mesajul părăsirii serverului a fost actualizat în	\`${message}\`. Va fi trimis în <#${channelID}>.`, 
    FAREWELL_RESET:                                 "Mesajele de părăsire au fost resetate.",

    //getavatar.js
    AVATAR_NOT_LOADING:                             avatar => `[Imaginea nu se încarcă?](${avatar})`,


    //greet.js
    GREETING_UPDATED:                               (message, channelID) => `:ok_hand: Mesajul intrării în server a fost actualizat în \`${message}\`. Va fi trimis în <#${channelID}>.`,
    GREETING_RESET:                                 "Mesajele de bunvenit au fost resetate.",

    //hackban.js
    HACKBANNED_USERS:                               users => `:ok_hand: Accesul a utilizatoriilor ${users} în server a fost interzisă, user${users !== 1 ? "s": ""} .`,

    //help.js
    HELP_PUBLIC:                                    "Comenzile publice",
    HELP_OWNER:                                     "Comenzile deținătorului",
    HELP_MOD:                                       "Comenzile moderatorului",
    HELP_ADMIN:                                     "Comenzile administratorului",
    HELP_FOR_COMMAND:                               command => `Ghid pentru comanda ${command}`,
    HELP_ARGUMENTS:                                 "Argumente",
    HELP_ALIASES:                                   "Pseudonime",
    HELP_DESCRIPTION:                               "Descriere",
    HELP_HOME:                                      (HelpMenu, permissions, msg) => `Bunvenit la ghidul folosirii tt.bot! Vă rugăm să folosiți reacțile de mai jos pentru a accesa ghidul pentru categoria comenzilor.\n:stop_button: Oprire\n:house: Acasă (această pagină)\n${HelpMenu.MESSAGES(msg).filter((_, idx) => permissions[idx]).join("\n")}`,
    HELP_NO_DESCRIPTION:                            "Nicio descriere",
    HELP_REMINDER:                                  `Folosiți ${config.prefix}help <commandă> pentru a vedea mai multe informații despre aceasta.`,

    //info.js
    INFO_STATS:                                     "Statistici",
    INFO_STATS_TEXT:                                () => `Nivel: ${bot.guilds.size}\nUtilizatori în cache: ${bot.users.size}\nCanale: ${Object.keys(bot.channelGuildMap).length}`,
    INFO_AUTHORS:                                   "Autor(i) și ghid",
    INFO_OWNERS:                                    ownerStrings => `${ownerStrings.join("\n")}\n[Server pentru suport](https://discord.gg/pGN5dMq)\n[Colecție în Github](https://github.com/tttie/tttie-bot)`,
    INFO_VERSIONS:                                  "Versiuni:",
    INFO_UPTIME:                                    "Timp de funcționare:",

    //invite.js
    BOT_INVITE:                                     `Aici! <https://discordapp.com/oauth2/authorize?client_id=195506253806436353&scope=bot&permissions=-1\n\nDacă aveți nevoie de ajutor pentru folosirea acestui bot, veniți în serverul nostru pentru suport, link-ul de invitație pentru server este în comanda info.`,

    //inviteinspector.js
    CANNOT_GET_INVITE:                              "Nu pot să iau informațtii în link-ul de invitație.",
    INVITE_ERR_FOOTER:                              "Sunteți sigur/ă că nu accesul meu în server nu este interzis? Aceasta nu mere nici în grupuri DM.",
    INV_CHANNEL_TYPE:                               "Tipul de canal",
    INV_CHANNEL_TYPE_VAL:                           (type, channelName) => `${type === 0 ? "Text" : "Voice"} canalul este numit ${bot.escapeMarkdown(channelName)}`,
    INV_GUILD_ID:                                   "ID de nivel",
    INV_MEMBERS_VAL:                                (members, presences) =>  `${members} (de) membrii din care ${presences} sunt online.`,
    INV_JOIN:                                       "Intrare",
    INV_JOIN_LINK:                                  code =>  `Apăsați clic [aici](https://discord.gg/${code})`,
    INV_INVITER:                                    user => `Invitat/ă de ${user}`,

    //kick.js
    KICK_DONE:                                      user => `:ok_hand: Utilizatorul ${bot.getTag(user)} a fost scos afară din server.`,

    //logging.js
    LOGGING_ALREADY_SETUP:                          "Caracteristica de autentificare a fost deja setată în server. Doriți să o dezactivați?\nScrieți y sau yes pentru a o dezactiva. n sau no pentru a anula. Aveți 10 secunde la dispoziție de a răspunde.",
    LOGGING_DISABLED:                               "Gata! Caracteristica de autentificare a fost dezactivată cu succes.",
    LOGGING_SETUP:                                  "Setarea s-a terminat! De acum, când unele dintre următoarele evenimente sunt declanșate, le voi trimite aici.",

    //needsmorejpeg.js
    // No terms for this one.

    // phone.js
    // Niciun termen pentru această comandă. N-am să mă ocup deocamdată de speakerphone.

    //ping.js
    PING_LATENCY:                                   ms => `A durat ${ms}ms să deie ping.`,
    PING_DISCORD_LATENCY:                           ms => `Latența portalului Discord: ${ms}ms`,
    PONG:                                           ":ping_pong: Pong",

    //profile.js
    PROFILE_NONEXISTENT:                            "Nu ai creat un profil încă!",
    PROFILE_DELETED:                                "Profilul dvs. a fost șters.",
    PROFILE_CREATED:                                "Ok. Profilul dvs. a fost creat.",
    INVALID_COLOR:                                  "Această culoare nu este valabilă! Această comandă permite culori hexagonale (#1234AB)",
    BOT_PROFILE:                                    "Boții n-au profil.",
    PROFILE_SPECIFIC_NONEXISTENT:                   user => `${user} n-are niciun profil.`,
    NO_PROFILE_FIELDS:                              "Niciun câmp de profil",
    FIELD_CREATED:                                  field => `Am făcut un câmp cu numele de \`${field}\`.`,
    FIELD_DELETED:                                  field => `Am șters câmpul \`${field}\``,
    FIELD_NONEXISTENT:                              "Acel câmp nu există!",
    INVALID_TIMEZONE:                               `Acest fus orar este invalid. Puteți găsi o listă cu fusuri orare posible [aici](https://cdn.rawgit.com/TTtie/TTtie-Bot/master/tz.txt)`,
    INVALID_LOCALE:                                 locale => `Locație invalidă \`${locale}\``,
    LOCALE_SET:                                     locale => `Am setat locația dvs. în ${locale}.`,

    //serverinfo.js
    GUILD_VERIFICATION_NONE:                        "Niciunul",
    GUILD_VERIFICATION_LOW:                         "Scăzut (Trebuie să aibă un email verificat pe contul de Discord)",
    GUILD_VERIFICATION_MEDIUM:                      "Mediu (Trebuie de asemenea să fie înregistrat/ă pe Discord mai mult de 5 minute)",

        //Acestea au tableflip-uriile pierdute deoarece tableflip-uriile nu sunt traductibile.
    GUILD_VERIFICATION_TABLEFLIP:                   "(Trebuie de asemenea să fie înregistrat pe Discord mai mult de 5 minute și să fie în server mai mult de 10 minute)",
    GUILD_VERIFICATION_ULTRATABLEFLIP:              "(Trebuie să aibă un număar de telefon verificat pe contul de Discord)",
    GUILD_VERIFICATION_LEVEL:                       "Nivel de verificare",
    REQUIRES_ADMIN_MFA:                             "Trebuie să aiba admin 2FA",
    MEMBER_COUNT:                                   members => `${members} member${members !== 1 ? "s" : ""}`,
    ROLE_COUNT:                                     roles => `${roles} role${roles !== 1 ? "s" : ""}`,
    EXPLICIT_FILTERING:                             "Filtru de conținut explicit",
    EXPLICIT_FILTERING_OFF:                         "Oprit",
    EXPLICIT_FILTERING_NOROLE:                      "Pornit pentru utilizatorii care n-au niciun rol",
    EXPLICIT_FILTERING_ON:                          "Pornit",
    DEFAULT_NOTIFICATIONS:                          "Setare pentru notificări implicite",
    ONLY_MENTIONS:                                  "Doar @menționări",
    ALL_MESSAGES:                                   "Toate mesajele",
    VOICE_REGION:                                   "Regiune de voce",
    AFK_TIMEOUT:                                    "Timeout AFK",
    AFK_MINUTES:                                    timeout => `${timeout / 60} (de) minute`,
    AFK_CHANNEL:                                    "Numele canalului AFK",

    //softban.js
    SOFTBAN_DONE:                                   user => `:ok_hand: Accesul la server a utilizatorului ${bot.getTag(user)} i-a fost ușor interzisă.`,

    //strike.js
    BOTS_NOT_STRIKABLE:                             "N-ar trebui să dai strike la boți. Le rănești sentimentele :(",
    YOU_GOT_STRIKED:                                "It seems like you've got striked.",
    STRIKE_DETAILS:                                 (issuer, reason) => `Strike-ul a fost emis de ${issuer} pentru care motivul este \`${reason || "No reason"}\`.`,
    PAY_ATTENTION:                                  "Ai grijă ce faci!",

    //strikes.js
    TOO_MUCH_STRIKES:                               "Utilizatorul are prea multe strike-uri ca să fiu ecranizate in embed. În loc aici este un fișier text:",
    STRIKE_OVERVIEW:                                user => `Aici sunt strike-uriile utilizatorului ${user}`,

    //tags.js
    TAG_CREATED:                                    tag => `Am creat un tag cu numele de \`${tag}\`.`,
    TAG_EXISTS:                                     "Acest tag deja există!",
    TAG_DOESNTEXIST:                                "Acest tag nu există.",
    TAG_NOTOWNER:                                   "Nu deții acest tag.",
    TAG_DELETED:                                    tag => `Am șters tag-ul cu numele de \`${tag}\`.`,
    TAG_UPDATED:                                    tag => `Am actualizat tag-ul cu numele de \`${tag}\`.`,
    TAG_DISPLAY:                                    tag => `Tag ${tag}`,

    //talk.js
    QUERY_TOO_LONG:                                 "Întrebarea dvs. este prea lungă.",
    CANT_TELL:                                      "Nu știu cum pot răspunde la aia :/",

    //timefor.js
    NO_TZ:                                          "Acest utilizator nu și-a setat înca un fus orar.",
    TIME_FOR:                                       (time, user) => `Timpul este ${time} pentru ${user}.`,

    //uinfo.js
    PLAYING:                                        "Se joacă",
    STREAMING:                                      "Face streaming la",
    LISTENING_TO:                                   "Ascultă la",
    ONLINE:                                         "Online",
    IDLE:                                           "Inactiv",
    DND:                                            "Nu deranja",
    OFFLINE:                                        "Invizibil/Offline",
    USER_INFO:                                      (nickstr, limited = false) => `${limited? "Limited i" : "I"}nformație pentru ${nickstr}`,
    PLAYING_NONE:                                   "Nimica",
    SPACE_UNIVERSE:                                 "cu un univers în spațiu.\nSucces, A-ți găsit un ou de paște :eyes:",
    CURRENT_VOICE:                                  "Canalul de voice actual",
    JOINED_ON:                                      "Intrat din",
    NO_CURRENT_VOICE:                               "Niciunul",

    //#endregion commands

    //#region events
    // Este posibil ca deținătorul serverului să aibă un profil.
    HI_I_AM_BOT:                                    `:wave: Salutare!`,
    SOME_THINGS_SAID:                               () => `Mă numesc ${bot.user.username} și sunt o instanță de tt.bot, un bot de Discord multifuncțional și distractiv. Am avut o presimțire că trebuia să mă descriu ție.`,
    GETTING_STARTED:                                ":floppy_disk: Noțiuniie de bază",
    GETTING_STARTED_DESCRIPTION:                    `Nu avețti nevoie să setați tt.bot pentru folosirea caracteristicilor simple! Oricum, pentru ca să folosiți niște comenzi de moderare, dvs. (sau oricine altcineva cu permisiuni administrative) o să trebuiască să folosiți comanda \`${config.prefix}config\` ca să creați niște configurații. Și cam atât basic! Dă-le rolul "tt.bot mod" la moderatori și o să înceapă să modereze server-ul! Sau setează "modRole" în orice nume rolul tău ar avea.`,
    EVERYTHING_ELSE:                                ":books: Orice altceva",
    EVERYTHING_ELSE_DESCRIPTION:                    "Dacă aveți nevoie de ajutor (sau doar ca să vă disrați în prejur), veniți în server-ul nostru pentru suport; link-ul de invitație este în comanda info.",
    THANKS_FOR_CHOOSING:                            "Vă mulțumim mult pentru că a-ți ales tt.bot!",
    WISHING_GOOD_LUCK:                              "*Vă dorim mult succes ci server-ul dvs.-*",
    //#endregion events

    //#region queries
    ITEM_NOT_FOUND:                                 (query, notfound) => `N-am putut găsi ${query}. Sunteți sigur/ă că există? ${notfound}`,
    MULTIPLE_ITEMS_FOUND:                           "S-au găsit articole multiple!",
    MULTIPLE_ITEMS_DESCRIPTION:                     (items, list) => `Am găsit ${items} (de) articole, ecranizând 5 dintre cele mai căutate.
${list}
Alege unul de la utilizatori, ajungând la numărul lânga numele utilizatorului.
Altfel, reacționați cu ❌ ca să anulați.
Întrebarea va expira automat în 5 minute.`,

    //#endregion queries

    // Aici vor fi traducerile pentru webserver cât de curând, dar deocamdată nu pot să mă asortez cu asta.


    // Reaction menu
    REACTION_MENU_EXIT_MANUAL:                      "A-ți ieșit din meniu.",
    REACTION_MENU_EXIT_MESSAGE_DELETE:              "A-ți fost scos din meniu deoarece mesajul a fost șters.",
    REACTION_MENU_EXIT_CHANNEL_DELETE:              "A-ți fost scos din meniu deoarece canalul a fost șters.",
    REACTION_MENU_NO_AUTOREMOVE:                    "Eroare: Nu-ți pot șterge reacția deoarece n-am permisiuniile specifice pentri aceasta.\nDacă îmi dați permisiunile specifice, vă voi șterge reacția după conveniența dvs..",

    // General
    NONE:                                           "Nimic",
    MEMBERS:                                        "Membri",
    OWNER:                                          "Deținătorul",
    ROLES:                                          "Roluri",
    STATUS:                                         "Statistici",
    REASON:                                         "Motiv",
    OP_CANCELLED:                                   "Operație anulată.",
    COMMAND_ERROR:                                  "Scuze, dar n-am primit comanda cum trebuie. Vă rugăm să verificați input-ul de două ori si re-rulați comanda.",
    ARGS_MISSING:                                   `A-ți ratat niște argumente necesare. :thinking:`,
    ROLE_HIERARCHY_ERROR:                           `Nu pot face asta în acel utilizator.`,
    ERROR:                                          err => `Ups, am încercat să executez comanda dar am căzut într-o eroare. Vă rugăm să trimite-ți asta la programatorii / dezvoltatorii mei.\n\`\`\`js\nError:\n${err}\n\`\`\``,
    OOPS:                                           `Ups.. Am niște probleme mici.`,
    MISSING_PERMISSIONS:                            `N-am permisiunea de a face asta în server-ul dvs..`,
    CREATED_ON:                                     "Creat pe",
    YES:                                            "Da",
    NO:                                             "Nu",
    TOOLONG:                                        "Prea lung ca să ecranizez, îmi pare rău. :(",
    
    NATIVE_LOCALE_NAME:                             "Română",
    ENGLISH_LOCALE_NAME:                            "Romanian"
};