
module.exports = {
    exec: async function (msg) {
        await cmds["exec"].exec(msg, "git pull --recurse-submodules");
    },
    category: 2,
    isCmd: true,
    description: "pulls latest stuff. if ur not an owner go away",
    display: true,
};