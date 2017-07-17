module.exports = {
    exec: function (msg) {
        if (isO(msg)) {
            console.log(`${__filename}      | ${msg.author.username}#${msg.author.discriminator} initiated exit.`);
            console.log("Quitting...........");
            process.exit(0);
        }
    },
    name: "exit",
    isCmd: true,
    category: 2,
    display: true,
    description: "Shuts down."
};