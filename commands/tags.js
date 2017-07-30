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
            let data = await db.table("tags").get(tagName);
            let profile = await db.table("profile").get(data.owner);
            if (!data) return await msg.channel.createMessage("No such tag.");
            msg.channel.createMessage({
                embed: {
                    author: {
                        name: `Tag ${tagName}`
                    },
                    description: data.content.replace(/\[/g, "\\[").replace(/\]/g, "\\]").replace(/\(/g, "\\(").replace(/\)/g, "\\)"),
                    color: profile ? profile.color : ""
                }
            });
        }
        async function create(tagName, content) {
            let data = await db.table("tags").get(tagName);
            if (data) return await msg.channel.createMessage(`That tag already exists!`)
            await db.table("tags").insert({
                id: tagName,
                content: content,
                owner: msg.author.id
            });
            await msg.channel.createMessage(`Created the tag ${tagName} successfully.`);
        }
        async function edit(tagName, content) {
            let data = await db.table("tags").get(tagName);
            if (!data) return await msg.channel.createMessage("No such tag.");
            if (isTagOwner(msg.author.id, data)) {
                if (!content) return msg.channel.createMessage("I don't have anything to update!");
                else {
                    await db.table("tags").get(tagName).update({
                        content: content
                    });
                    msg.channel.createMessage(`Updated the tag ${tagName}.`);
                }
            } else {
                return await msg.channel.createMessage("You're not an owner of this tag.");
            }
        }
        async function del(tagName) {
            let data = await db.table("tags").get(tagName);
            if (!data) return await msg.channel.createMessage("No such tag.");
            if (isTagOwner(msg.author.id, data)) {
                await db.table("tags").get(tagName).delete();
                msg.channel.createMessage(`Deleted the tag ${tagName}.`);
            } else {
                return await msg.channel.createMessage("You're not an owner of this tag.");
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
    description: "Store the messages",
    args: "<show <name>|create <name>|<content>|edit <name>|<content>|delete <name>>",
    aliases: [
        "tag", "t"
    ]
};