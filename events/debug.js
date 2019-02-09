module.exports = function(m) {
    if (config.debugLogging) console.log("DEBUG:", m);
};
module.exports.isEvent = true;