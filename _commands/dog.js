const { get } = require("snekfetch");
module.exports = {
    exec: async function (msg) {
        const { body } = await get("https://random.dog/woof.json");
        msg.channel.createMessage({embed:{image:{url: body.url}, color: 0x008800}});
    },
    isCmd: true,
    display: true,
    category: 1,
    description: "Gets a random dog picture.",
};