module.exports = function (msg) {
    if (msg.channel instanceof ErisO.PrivateChannel) return;
    if (msg.author.bot) return;
    if (msg.content.startsWith(config.prefix)) {
        let nameslice = msg.content.slice(config.prefix.length);
        console.log("Received a command message from", msg.author.username, nameslice, "from guild", msg.channel.guild.name, `(${msg.channel.guild.id})`)
        let cmdName = nameslice.split(" ")[0];
        let args = nameslice.slice(cmdName.length).slice(1);
        try {
            let cmd = cmds[cmdName];
            if (cmd) {
                let e = cmd.exec(msg, args);
            }
        } catch (err) {
            console.error(err);
        }
    }
}
module.exports.isEvent = true;