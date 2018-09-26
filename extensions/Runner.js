const Sandbox = require("./Sandbox");
const {VM} = require("vm2");

module.exports = (msg, bot, code, {id, name, data}) => {
    const vm = new VM({
        sandbox: Sandbox(msg, bot, {id, name, data}),
        timeout: 10000
    });
    try {
        vm.run(code);
        return { error: false };
    } catch(error) {
        return { error };
    }
}