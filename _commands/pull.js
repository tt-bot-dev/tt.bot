
module.exports = {
    exec: async function (msg) {
        await cmds["exec"].exec(msg, "git pull --recurse-submodules");
    },
    category: 2,
    isCmd: true,
    description: "A simple shortcut that pulls newest data.",
    display: true,
};