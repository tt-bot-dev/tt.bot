const CensorBuilder = require("../CensorBuilder");
module.exports = {
    exec: async function (msg, args) {

        let evaLUAted;
        try { evaLUAted = await eval(`(async () => {${args}})()`); }
        catch (err) { evaLUAted = err.message; console.error(err.stack); }
        let overall;
        if (typeof evaLUAted !== "string") {
            overall = require("util").inspect(evaLUAted);
        } else overall = evaLUAted;
        const censor = new CensorBuilder();
        let data = `\`\`\`js\n${overall.replace(censor.build(), "jako rilý?")}\n\`\`\``;
        if (data.length > 2048) {
            if (config.gistKey) {
                let gist;
                try {
                    gist = await require("superagent").post("https://api.github.com/gists").set("Authorization", `Token ${config.gistKey}`).send({
                        description: "Evaluated code",
                        public: false,
                        files: {
                            "exec.md": {
                                content: data
                            }
                        }
                    });

                } catch (err) {
                    console.log(overall); // we don't replace anything here, because that's console
                }
                return await msg.channel.createMessage({
                    embed: {
                        title: "Evaluated!",
                        color: 0x008800,
                        description: `The data are too long. [View the gist here](${gist.body.html_url})`
                    }
                });
            } else {
                await msg.channel.createMessage({
                    embed: {
                        title: "Evaluated!",
                        color: 0x008800,
                        description: `Unfortunately, we can't provide the data here because they're too long and you haven't provided a GitHub Gist API key.\nThereby, the output has been logged in the console.`
                    }
                })
                console.log(overall);
                return;
            }
        }
        bot.createMessage(msg.channel.id, {
            embed: {
                title: "Evaluated!",
                description: data,
                color: 0x008800
            }
        });
    },
    category: 2,
    isCmd: true,
    description: "evaluates js. if ur not an owner go away",
    display: true,
    name: "eval",
    args: "<code>"
};