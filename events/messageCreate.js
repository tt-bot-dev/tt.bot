module.exports = function (msg) {
    if (msg.channel instanceof ErisO.PrivateChannel) return;
    if (msg.author.bot) return;
    if (msg.content.startsWith("tt.")) {
        let nameslice = msg.content.slice("tt.".length);
        console.log("Received a command message from", msg.author.username, nameslice, "from guild", msg.guild.name, `(${msg.guild.id})`)
        let cmdName = nameslice.split(" ")[0];
        let args = nameslice.slice(cmdName.length).slice(1);
        try {
            let cmd = cmds[cmdName];
            if (cmd) {
                let e = cmd.exec(msg, args);
                console.log(e);
            }
        } catch (err) {
            console.error(err);
        }
    }
}
module.exports.isEvent = true;