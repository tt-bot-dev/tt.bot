const TagObject = require("../lib/structures/TagObject");
const UserProfile = require("../lib/Structures/UserProfile");
module.exports = {
    exec: async function (msg, args) {
        let split = args.split(" ");
        let action = split[0];
        let otherArgs = split.slice(1).join(" ").split("|");
        function isTagOwner(id, data) {
            if (id == config.oid) return true;
            if (data.owner == id) return true;
            return false;
        }
        async function show(tagName) {
            if (!tagName) return await msg.channel.createMessage(msg.t("ARGS_MISSING"));
            let tagData = await db.table("tags").get(encryptData(tagName));
            if (!tagData) return await msg.channel.createMessage(msg.t("TAG_DOESNTEXIST"));
            let data = new TagObject(tagData);
            let profileData = await db.table("profile").get(data.owner);
            let profile = profileData? new UserProfile(profileData) : undefined;
            msg.channel.createMessage({
                embed: {
                    author: {
                        name: msg.t("TAG_DISPLAY", tagName)
                    },
                    description: bot.parseMsg(data.content.replace(/\[/g, "\\[").replace(/\]/g, "\\]").replace(/\(/g, "\\(").replace(/\)/g, "\\)"), msg.member, msg.guild),
                    color: profile ? profile.color : null
                }
            });
        }
        async function create(tagName, content) {
            if (!tagName || !content) return await msg.channel.createMessage(msg.t("ARGS_MISSING"));
            let data = await db.table("tags").get(encryptData(tagName));
            if (data) return await msg.channel.createMessage(msg.t("TAG_EXISTS"));
            await db.table("tags").insert(TagObject.create({
                id: tagName,
                content: content,
                owner: msg.author.id
            }));
            await msg.channel.createMessage(msg.t("TAG_CREATED", tagName));
        }
        async function edit(tagName, content) {
            if (!tagName) return await msg.channel.createMessage(msg.t("ARGS_MISSING"));
            let tdata = await db.table("tags").get(encryptData(tagName));
            if (!tdata) return await msg.channel.createMessage(msg.t("TAG_DOESNTEXIST"));
            let data = new TagObject(tdata);
            if (isTagOwner(msg.author.id, data)) {
                if (!content) return msg.channel.createMessage(msg.t("ARGS_MISSING"));
                else {
                    data.content = content;
                    await db.table("tags").get(encryptData(tagName)).update(data.toEncryptedObject());
                    msg.channel.createMessage(msg.t("TAG_UPDATED", tagName));
                }
            } else {
                return await msg.channel.createMessage(msg.t("TAG_NOTOWNER"));
            }
        }
        async function del(tagName) {
            if (!tagName) return await msg.channel.createMessage(msg.t("ARGS_MISSING"));
            let data = await db.table("tags").get(encryptData(tagName));
            if (!data) return await msg.channel.createMessage(msg.t("TAG_DOESNTEXIST"));
            if (isTagOwner(msg.author.id, data)) {
                await db.table("tags").get(encryptData(tagName)).delete();
                msg.channel.createMessage(msg.t("TAG_DELETED", tagName));
            } else {
                return await msg.channel.createMessage(msg.t("TAG_NOTOWNER"));
            }
        }
        switch (action) {
        default:
            cmds["help"].exec(msg, "tags");
            break;
        case "show":
            await show(otherArgs[0].trim());
            break;
        case "create":
            await create(otherArgs[0].trim(), otherArgs.slice(1).join("|"));
            break;
        case "edit":
            await edit(otherArgs[0].trim(), otherArgs.slice(1).join("|"));
            break;
        case "delete":
            await del(otherArgs[0].trim());
            break;
        }
    },
    isCmd: true,
    display: true,
    category: 1,
    description: "Store something for later retrieval; keep in mind that tags are public. Using [ttMsg](https://github.com/tt-bot-dev/tt.bot/blob/master/docs/ttMsg.md) is allowed.",
    args: "<show <name>|create <name>|<content>|edit <name>|<content>|delete <name>>",
    aliases: [
        "tag", "t"
    ]
};