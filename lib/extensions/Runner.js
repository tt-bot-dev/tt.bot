const Sandbox = require("./Sandbox");
const { VM, VMScript } = require("vm2");

module.exports = (ctx, bot, code, { id, name, data }, commandData) => {
    const vm = new VM({
        sandbox: Sandbox(ctx, bot, { id, name, data }, commandData),
        timeout: 10000,
        wasm: false
    });
    const script = new VMScript(code, `tt.bot/${id}/extension.js`)
    try {
        vm.run(script);
        return { error: false };
    } catch (error) {
        const stack = error.stack.split("\n");
        const errorObject = new (class ExtensionError extends Error {
            constructor() {
                super();
                this.message = error.message;
                this.name = error.name;
                this.stack = stack.slice(0, stack.length - 5).join("\n");
            }
        });
        return { 
            error: errorObject
        };
    }
}