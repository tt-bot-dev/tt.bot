module.exports = async function (msg) {
    if (msg.channel instanceof ErisO.PrivateChannel) return; // ignore DMs
    if (!msg.author) return; // Message.author is occasionally undefined. abal plz fix
    if (msg.author.bot) return; // ignore bots
    if (msg.channel.topic && msg.channel.topic.includes("[tt.bot block]")) return // we ignore the channel when [tt.bot block] is anywhere in the message.
    let server = await db.table("configs").get(msg.guild.id).run();
    msg.guildConfig = server;
    if ((server && msg.content.startsWith(server.prefix)) || msg.content.startsWith(config.prefix)) { // if the content starts with the prefix
        let nameslice = (server && msg.content.startsWith(server.prefix)) ? msg.content.slice(server.prefix.length) : msg.content.slice(config.prefix.length) // we slice it so we can get the command
        console.log("Received a command message from", msg.author.username, nameslice, "from guild", msg.channel.guild.name, `(${msg.channel.guild.id})`) // we log it, because why not
        let cmdName = nameslice.split(" ")[0]; //  we split the slice output by spaces and choosing the command from the first element
        let args = nameslice.slice(cmdName.length).slice(1); // we determine arguments
        let cmdAlias = cmdAliases[cmdName.toLowerCase()]
        try {
            let cmd = cmds[cmdName.toLowerCase()]; // we load it from object
            if (!cmd) cmd = cmds[cmdAlias]
            if (cmd) {
                let e = cmd.exec(msg, args); // we execute it
            }
        } catch (err) {
            console.error(err); // if an error is thrown, we log it.
        }
    }
}
module.exports.isEvent = true; // event declaration