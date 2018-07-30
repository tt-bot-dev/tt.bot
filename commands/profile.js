const UserProfile = require("../Structures/UserProfile");
module.exports = {
    exec: async function (msg, args) {
        let [action, ...rest] = args.split(" ");
        let a = rest.join(" ");
        if (!action) return cmds["help"].exec(msg, "profile");
        async function remove() {
            if (!msg.userProfile) return msg.channel.createMessage(msg.t("PROFILE_NONEXISTENT"));
            else {
                await db.table("profile").get(msg.author.id).delete();
                msg.channel.createMessage(msg.t("PROFILE_DELETED"));
            }
        }

        async function setup() {
            if (msg.userProfile) return;
            let data = {
                id: msg.author.id,
                profileFields: [],
                color: null,
                timezone: "UTC",
                locale: "en"
            };
            let color = a;
            let num;
            if (color.startsWith("#")) color = color.slice(1);
            if (color) num = new Number(`0x${color.substring(0, 6)}`);
            if (num && isNaN(num)) return msg.channel.createMessage(msg.t("INVALID_COLOR"));
            data.color = num ? num.toString() : "";
            await db.table("profile").insert(UserProfile.create(data));
            await msg.channel.createMessage(msg.t("PROFILE_CREATED"));
        }
        async function show() {
            let query = a;
            let user;
            try {
                user = await userQuery(query || msg.author.id, msg, true);
            } catch (e) {
                return;
            }
            if (user.bot) return msg.channel.createMessage(msg.t("BOT_PROFILE"));
            let profileData = await db.table("profile").get(user.id);
            if (!profileData) return msg.channel.createMessage(msg.t("PROFILE_SPECIFIC_NONEXISTENT", bot.getTag(user)));
            let profile = new UserProfile(profileData);
            return msg.channel.createMessage({
                embed: {
                    author: {
                        name: `${user.user.username}#${user.user.discriminator}'s profile`,
                        icon_url: user.user.staticAvatarURL
                    },
                    fields: (profile.profileFields && profile.profileFields.length > 0) ? profile.profileFields : [{
                        name: "<:xmark:314349398824058880>",
                        value: msg.t("NO_PROFILE_FIELDS"),
                        inline: true
                    }],
                    color: parseInt(profile.color)
                }
            });
        }

        async function color() {
            if (!msg.userProfile) return msg.channel.createMessage(msg.t("PROFILE_NONEXISTENT"));
            let color = a;
            if (color.startsWith("#")) color = color.slice(1);
            if (!color) return msg.channel.createMessage(msg.t("ARGS_MISSING"));
            let n;

            if (color) n = new Number(`0x${color.substring(0, 6)}`);
            if (n && isNaN(n)) return msg.channel.createMessage(msg.t("INVALID_COLOR"));
            msg.userProfile.color = n.toString();
            await db.table("profile").get(msg.author.id).update(msg.userProfile.toEncryptedObject());
            msg.channel.createMessage({
                content: ":ok_hand:",
                embed: {
                    color: msg.userProfile.color,
                    author: {
                        name: `${bot.getTag(msg.author)}`,
                        icon_url: msg.author.staticAvatarURL
                    },
                    description: "Lorum ispum dolor sit amet..."
                }
            });

        }


        async function fields() {
            if (!msg.userProfile) return msg.channel.createMessage(msg.t("PROFILE_NONEXISTENT"));
            const p = msg.userProfile;
            let arg = a;
            if (!arg) return msg.channel.createMessage(msg.t("ARGS_MISSING"));
            let [act, ...stuff] = arg.split(" ");
            let fieldsargs = stuff.join(" ").split("|");
            let fieldname = fieldsargs[0];
            let fielddata = fieldsargs.slice(1).join("|");
            switch (act) {
            default: {
                msg.channel.createMessage(":question: fields <add|del> <<name><|data, not required for del>>");
                break;
            }
            case "del": {
                if (p.profileFields.length == 0) return;
                let f = p.profileFields.find(f => f.name == fieldname);
                if (f) p.profileFields.splice(p.profileFields.indexOf(f), 1);
                else return msg.channel.createMessage(msg.t("FIELD_NONEXISTENT"));
                await db.table("profile").get(msg.author.id).update(p.toEncryptedObject());
                msg.channel.createMessage(msg.t("FIELD_DELETED", fieldname));
                break;
            }
            case "add": {
                if (p.profileFields && p.profileFields.length > 10) return;
                if (p.profileFields && p.profileFields.find(f => f.name.toLowerCase() == fieldname.toLowerCase())) return;
                p.profileFields.push({
                    name: fieldname,
                    value: fielddata,
                    inline: true
                });
                await db.table("profile").get(msg.author.id).update(p.toEncryptedObject());
                msg.channel.createMessage(msg.t("FIELD_CREATED", fieldname));
                break;
            }
            }
        }

        
        async function timezone() {
            if (!msg.userProfile) return msg.channel.createMessage(msg.t("PROFILE_NONEXISTENT"));
            let tzValue = a;
            if (!momentTz.tz.zone(tzValue)) return msg.channel.createMessage(msg.t("INVALID_TIMEZONE"));
            msg.userProfile.timezone = tzValue;
            await db.table("profile").get(msg.author.id).update(msg.userProfile.toEncryptedObject());
            msg.channel.createMessage(":ok_hand:");
        }

        async function locale() {
            if (!msg.userProfile) return msg.channel.createMessage(msg.t("PROFILE_NONEXISTENT"));
            let lang = a;
            if(!bot.i18n.languages[lang]) return msg.channel.createMessage(msg.t("INVALID_LOCALE", lang));
            msg.userProfile.locale = lang;
            await db.table("profile").get(msg.author.id).update(msg.userProfile.toEncryptedObject());
            msg.channel.createMessage(msg.t("LOCALE_SET", `${lang} (${msg.t("NATIVE_LOCALE_NAME")}/${msg.t("ENGLISH_LOCALE_NAME")})`));

        }
        switch (action) {
        case "remove": {
            await remove();
            break;
        }
        case "setup": {
            await setup();
            break;
        }
        case "show": {
            await show();
            break;
        }
        case "color": {
            await color();
            break;
        }
        case "fields": {
            await fields();
            break;
        }
        case "timezone": {
            await timezone();
            break;
        }
        case "locale": {
            await locale();
            break;
        }
        }
    },
    isCmd: true,
    display: true,
    category: 1,
    description: "Shows the profile of the user (NOT USER DATA).\nLocale list [here](https://github.com/tt-bot-dev/languages)",
    args: "<show [user]|setup [color]|fields <del|add> <<name><|data, not required for del>>|remove|color <color>|locale <locale>>"
};