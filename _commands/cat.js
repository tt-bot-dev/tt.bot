const { get } = require("snekfetch");
module.exports = {
    exec: async function (msg) {
        const { body } = await get("http://aws.random.cat/meow");
        msg.channel.createMessage({embed:{image:{url: body.file}, color: 0x008800}});
    },
    isCmd: true,
    display: true,
    category: 1,
    description: "Gets a random cat picture.",
};