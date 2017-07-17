module.exports = {
    exec: async function (msg) {
        let data = await require("superagent").get("https://random.dog/woof");
        msg.channel.createMessage({embed:{image:{url: "https://random.dog/"+data.text}, color: 0x008800}});
    },
    isCmd: true,
    display: true,
    category: 1,
    description: "Gets a random cat picture.",
};