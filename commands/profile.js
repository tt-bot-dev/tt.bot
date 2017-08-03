module.exports = {
    exec: async function (msg, args) {
        let action = args.split(" ")[0];
        if (!action) return msg.channel.createMessage("WHAT THE HECK DO I DO?1??1?1??!!!!!1!1!1");
        switch (action) {
        case "remove": {
            async function remove() {
                let d = await db.table("profile").get(msg.author.id);
                if (!d) return msg.channel.createMessage("You haven't created a profile.");
                else {
                    await db.table("profile").get(msg.author.id).delete();
                    msg.channel.createMessage("Deleted your profile.");
                }
            }
            await remove();
            break;
        }
        case "setup": {
            async function setup() {
                let pdata = await db.table("profile").get(msg.author.id);
                if (pdata) return msg.channel.createMessage("You have a profile already :^)");
                let da = {
                    id: msg.author.id,
                    profileFields: [],
                    color: null,
                    timezone: "CET"
                };
                let optar = args.slice((action.length + 1));
                let num;
                if (optar) num = new Number(`0x${optar.substring(0, 6)}`);
                if (num && isNaN(num)) return msg.channel.createMessage("That's not a valid hex color.");
                da.color = num ? num.toString() : "";
                await db.table("profile").insert(da);
                await msg.channel.createMessage("Created a profile.");
            }
            await setup();
            break;
        }
        case "show": {
            async function show() {
                let optargs = args.slice((action.length + 1));
                let user;
                try {
                    user = await userQuery(optargs || msg.author.id, msg);
                } catch (e) {
                    return msg.channel.createMessage("I guess, we end here.");
                }
                if (user.bot) return msg.channel.createMessage("Bots can't have a profile :thinking:");
                let profileData = await db.table("profile").get(user.id);
                if (!profileData) return msg.channel.createMessage(`Can't get profile data for ${user.user.username}#${user.user.discriminator}.`);
                else return msg.channel.createMessage({
                    embed: {
                        author: {
                            name: `${user.user.username}#${user.user.discriminator}'s profile`,
                            icon_url: user.user.staticAvatarURL
                        },
                        fields: profileData.profileFields.length > 0 ? profileData.profileFields : [{
                            name: "<:xmark:314349398824058880>",
                            value: "No profile fields",
                            inline: true
                        }],
                        color: parseInt(profileData.color)
                    }
                });
            }
            await show();
            break;
        }
        case "color": {
            async function color() {
                let dat = await db.table("profile").get(msg.author.id);
                if (!dat) return msg.channel.createMessage("You don't have a profile yet!");
                let opta = args.slice((action.length + 1));
                if (!opta) return msg.channel.createMessage("No arguments provided.");
                let n;
                if (opta) n = new Number(`0x${opta.substring(0, 6)}`);
                if (n && isNaN(n)) return msg.channel.createMessage("That's not a valid hex color.");
                dat.color = n.toString();
                await db.table("profile").get(msg.author.id).update(dat);
                msg.channel.createMessage({
                    content: "Updated your profile color.\nColor simulation:",
                    embed: {
                        color: dat.color,
                        author: {
                            name: `${msg.author.username}#${msg.author.discriminator}`,
                            icon_url: msg.author.staticAvatarURL
                        },
                        description: "Lorum ispum etc....."
                    }
                });

            }
            await color();
            break;
        }
        case "fields": {
            async function fields() {
                let dat1 = await db.table("profile").get(msg.author.id);
                if (!dat1) return msg.channel.createMessage("You don't have a profile yet!");
                let optar = args.slice((action.length + 1));
                if (!optar) return msg.channel.createMessage("No arguments provided.");
                let act = optar.split(" ")[0];
                let fieldsargs = optar.slice((act.length + 1)).split("|");
                let fieldname = fieldsargs[0];
                let fielddata = fieldsargs.slice(1).join("|");
                switch (act) {
                default: {
                    msg.channel.createMessage("Usage: fields <add|del> <<name>|[data]>");
                    break;
                }
                case "del": {
                    if (dat1.profileFields.length == 0) return msg.channel.createMessage("You haven't got any field!");
                    let f = dat1.profileFields.find(f => f.name == fieldname);
                    if (f) dat1.profileFields.splice(dat1.profileFields.indexOf(f), 1);
                    else return msg.channel.createMessage("No such field :/");
                    await db.table("profile").get(msg.author.id).update(dat1);
                    msg.channel.createMessage("Deleted the field " + fieldname);
                    break;
                }
                case "add": {
                    if (dat1.profileFields.length > 10) return msg.channel.createMessage("There's a limit of 10 fields. Please remove the unneeded ones.");
                    if (dat1.profileFields.find(f => f.name.toLowerCase() == fieldname.toLowerCase())) return msg.channel.createMessage("That field already exists.");
                    dat1.profileFields.push({
                        name: fieldname,
                        value: fielddata,
                        inline: true
                    });
                    await db.table("profile").get(msg.author.id).update(dat1);
                    msg.channel.createMessage(`Made a field \`${fieldname}\` with this data \`\`\`\n${fielddata}\`\`\``);
                    break;
                }
                }
            }
            await fields();
            break;
        }
        case "timezone": {
            async function timezone() {
                let dat1 = await db.table("profile").get(msg.author.id);
                if (!dat1) return msg.channel.createMessage("You don't have a profile yet!");
                let tzValue = args.split(" ").slice(1).join(" ");
                if (!momentTz.tz.zone(tzValue)) return msg.channel.createMessage("Sorry, but your time zone is not in the list provided by moment-timezone.\nThat list can be found at <https://cdn.rawgit.com/TTtie/TTtie-Bot/master/tz.txt>.");
                dat1.timezone = tzValue;
                await db.table("profile").get(msg.author.id).update(dat1);
            }
            await timezone();
            break;
        }
        }
    },
    isCmd: true,
    display: true,
    category: 1,
    description: "Shows the profile of the user (NOT USER DATA).",
    args: "<show [user]|setup [color]fields <del|add> <<name>|[data]>|remove|color <color>>"
};