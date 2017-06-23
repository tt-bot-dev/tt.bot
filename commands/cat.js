module.exports = {
    exec: async function (msg, args) {
         let data = await require("superagent").get("http://random.cat/meow")
          msg.channel.createMessage({embed:{image:{url: data.body.file}, color: 0x008800}})
    },
    isCmd: true,
    display: true,
    category: 1,
    description: "Gets a random cat picture.",
}