module.exports = {
    exec: async function (msg, args) {
        if (isO(msg)) {
            let evaLUAted
            try { evaLUAted = await eval(`(async () => {${args}})()`) }
            catch (err) { evaLUAted = err.message; console.error(err.stack) }
            let overall;
            if (typeof evaLUAted !== "string") {
                overall = require("util").inspect(evaLUAted)
            } else overall = evaLUAted
            let data = `\`\`\`js\n${overall.replace(new RegExp(`${bot.token}|${config.token}|${config.dbots2key}|${config.dbotskey}|${config.clientSecret}`, "g"), "jako rilý?")}\n\`\`\``
            if (data.length > 2048) {
                let gist
                try {
                    gist = await require("superagent").post("https://api.github.com/gists").send({
                        description: "Evaluated code",
                        public: true,
                        files: {
                            "exec.md": {
                                content: data
                            }
                        }
                    })
                    
                } catch(err) {
                    console.log(overall) // we don't replace anything here, because that's console
                }
                return await msg.channel.createMessage({
                    embed: {
                        title: "Evaluated!",
                        color: 0x008800,
                        description: `The data are too long. [View the gist here](${gist.body.html_url})`
                    }
                })
            }
            bot.createMessage(msg.channel.id, {
                embed: {
                    title: "Evaluated!",
                    description: data,
                    color: 0x008800
                }
            })
        }
    },
    category: 2,
    isCmd: true,
    description: "evaluates js. if ur not an owner go away",
    display: true,
    name: "eval",
    args: "<code>"
}
/*
require("superagent").post("https://api.github.com/gists").send({
                description: "Evaluated code",
                public: true,
                files: {
                    "exec.md": {
                        content: data
                    }
                }
            })*/