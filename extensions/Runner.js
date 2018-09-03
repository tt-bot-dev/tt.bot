const Sandbox = require("./Sandbox");
const {VM} = require("vm2");

module.exports = (msg, bot, code) => {
    console.log("Running an extension with this code: ", code)
    const vm = new VM({
        sandbox: Sandbox(msg, bot),
        timeout: 10000
    });
    try {
        vm.run(code);
        return { error: false };
    } catch(error) {
        return { error };
    }
}