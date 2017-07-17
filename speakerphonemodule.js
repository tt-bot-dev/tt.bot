let emitter = require("./speakerphone/emitter");
let queuer = require("./speakerphone/queuer");
module.exports = {
    spkrphoneEmitter: emitter,
    binds: {},
    queuer: new queuer()
};