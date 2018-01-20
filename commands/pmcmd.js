module.exports = {
    exec: async function (msg, args) {
        if (args) {
            let c = args.split(" ");
            let cmd = c[0];
            let cmdargs = c.slice(1).join(" ");
            let cmn;
            if (cmdAliases[cmd]) cmn = cmdAliases[cmd]; else cmn = cmd;
            let commandToExec = cmds[cmn];
            if (commandToExec) {
                let guild = msg.guild;
                let member = msg.member;
                msg.channel = await bot.getDMChannel(msg.author.id);
                msg.member = member;
                msg.channel.guild = guild;
                msg.guild = guild;
                commandToExec.exec(msg, cmdargs);
            }
        }
        else {
            msg.channel.createMessage("What command I should PM you?");
        }
    },
    isCmd: false,
    display: true,
    category: 1,
    description: "PMs you the command output.",
    args: "<command> [command args]",
    aliases: [
        "messagecommand",
        "pm",
    ]
};