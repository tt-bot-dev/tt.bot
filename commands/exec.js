const CensorBuilder = require("../lib/CensorBuilderCensorBuilder");
const { spawn } = require("child_process");
/**
 * Executes the program, adding data as it is.
 */
function exec(command) {
    return new Promise((rs, rj) => {
        const [cmd, ...args] = command.split(" ");
        let b = [];
        const endHandler = (c, s) => {
            b.push(Buffer.from(`======= Program ${s ? `killed with the ${s} signal` : `exited with code ${c}`} =======`));
            rs(Buffer.concat(b).toString());
        };
        const s = spawn(cmd, args, {
            windowsHide: true, // Do not create a window if run inside PM2
            stdio: ["ignore", "pipe", "pipe"], // Do not pipe stdin
            shell: true,

        });
        s.on("error", e => rj(e))
            .on("exit", endHandler)
            .on("close", endHandler);
        s.stdout.on("data", d => b.push(d));
        s.stderr.on("data", d => b.push(d));
    });
}
module.exports = {
    exec: async function (msg, args) {

        let evaLUAted;
        try { evaLUAted = await exec(args); }
        catch (err) { evaLUAted = err.message; console.error(err.stack); }
        let overall;
        if (typeof evaLUAted !== "string") {
            overall = require("util").inspect(evaLUAted);
        } else overall = evaLUAted;
        const censor = new CensorBuilder();
        let data = `\`\`\`\n${overall.replace(censor.build(), "jako rilý?")}\n\`\`\``;
        if (data.length > 2048) {
            if (config.gistKey) {
                let gist;
                try {
                    gist = await require("snekfetch").post("https://api.github.com/gists").set("Authorization", `Token ${config.gistKey}`).send({
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
                        title: "Executed!",
                        color: 0x008800,
                        description: `The data are too long. [View the gist here](${gist.body.html_url})`
                    }
                });
            } else {
                await msg.channel.createMessage({
                    embed: {
                        title: "Executed!",
                        color: 0x008800,
                        description: "Unfortunately, we can't provide the data here because they're too long and you haven't provided a GitHub Gist API key.\nThereby, the output has been logged in the console."
                    }
                });
                console.log(overall);
                return;
            }
        }
        bot.createMessage(msg.channel.id, {
            embed: {
                title: "Executed!",
                description: data,
                color: 0x008800
            }
        });
    },
    category: 2,
    isCmd: true,
    description: "Executes shell commands on your machine.",
    display: true,
    args: "<commands>"
};