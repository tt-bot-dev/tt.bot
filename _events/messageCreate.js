const UserProfileStructure = require("../lib/Structures/UserProfile");
const ExtensionRunner = require("../lib/extensions/Runner");
async function dmOwner(owner, msg) {
    let pm = await this.getDMChannel(owner);
    let attachmentString = msg.attachments.map(a => a.url).join("\n");
    let embed = {
        author: {
            name: `${this.getTag(msg.author)} sent a PM to me!`,
            icon_url: msg.author.avatarURL
        },
        description: `${msg.content}\n${attachmentString}`
    };
    try {
        await this.createMessage(pm.id, {
            embed
        });
    } catch (err) {
        console.log(this.embedToText(embed));
    }
}
module.exports = async function (msg) {
    if (!msg.author) return; // Message.author is occasionally undefined. abal plz fix
    if (msg.author.bot) return; // ignore bots
    if (msg.channel instanceof ErisO.PrivateChannel) {
        if (config.reroutePMs) {
            if (isO(msg)) return;
            if (!Array.isArray(config.oid)) await dmOwner.bind(this)(config.oid, msg);
            else config.oid.forEach(async o => await dmOwner.bind(this)(o, msg));
        }
        if (msg.content.startsWith(config.prefix)) msg.channel.createMessage(`Hello ${this.getTag(msg.author)}, I think you're trying to execute some of my commands here in PMs. That won't work unfortunately. Try using the command in a server.`);
        return; // ignore DMs
    }
    if (msg.channel.topic && msg.channel.topic.includes("[tt.bot block]")) return; // we ignore the channel when [tt.bot block] is anywhere in the message.
    let server = await db.table("configs").get(msg.guild.id);
    let userData = await db.table("profile").get(msg.author.id);
    let user = userData ? new UserProfileStructure(userData) : null;
    msg.guildConfig = server;
    msg.userProfile = user;
    msg.t = (term, ...args) => bot.i18n.getTranslation(term, user ? user.locale || "en" : "en", ...args);

    if ((server && msg.content.toLowerCase().startsWith(server.prefix.toLowerCase())) || msg.content.toLowerCase().startsWith(config.prefix.toLowerCase())) { // if the content starts with the prefix
        let [cmdName, ...argumentArr] = ((server && msg.content.startsWith(server.prefix)) ? msg.content.slice(server.prefix.length) : msg.content.slice(config.prefix.length)).split(" "); // we slice it so we can get the command
        let args = argumentArr.join(" "); // we determine arguments
        let cmdAlias = cmdAliases[cmdName.toLowerCase()];
        try {
            let cmd = cmds[cmdName.toLowerCase()]; // we load it from object
            if (!cmd) cmd = cmds[cmdAlias];
            if (cmd) {
                if (!(await this.canUseCommand(msg.member, cmd))) return;
                console.log(
                    `Received a command message
    From        ${this.getTag(msg.author)} (${msg.author.id})
    Guild       ${msg.guild.name} (${msg.guild.id})
    Command     ${cmdName}
${args ? `    Arguments   ${args}` : ""}
`
                );
                return cmd.exec(msg, args);
            } else {
                const [extension] = await db.table("extensions").filter({
                    commandTrigger: cmdName.toLowerCase(),
                    guildID: msg.guild.id,
                });
                if (!extension) return;
                if (extension.allowedChannels.length !== 0 && !extension.allowedChannels.includes(msg.channel.id)) return;
                if (extension.allowedRoles.length !== 0 && !extension.allowedRoles.find(r => msg.member.roles.includes(r))) return;
                const store = await db.table("extension_store").get([msg.guild.id, extension.store]);
                const {error} = await ExtensionRunner(msg, bot, extension.code, {
                    id: extension.id,
                    name: extension.name,
                    data: store ? Object.assign({}, JSON.parse(store.store), {id: store.id, guildID: msg.guild.id}) : {guildID: msg.guild.id, id: null}
                }, {
                    prefix: server && server.prefix || config.prefix,
                    trigger: cmdName.toLowerCase(), args
                });
                if (error) msg.channel.createMessage({
                    embed: {
                        color: 0xFF0000,
                        title: msg.t("OOPS"),
                        description: msg.t("ERROR", error),
                        footer: {
                            text: `Extension ${extension.name} (ID ${extension.id})`
                        }
                    }
                });
            }
        } catch (err) {
            console.error(err); // if an error is thrown, we log it.
            if (sentry.enabled) sentry.raven.captureException(err);
        }
    }
};
module.exports.isEvent = true; // event declaration