const {pbkdf2Sync, createCipher, createDecipher} = require("crypto")
const password = pbkdf2Sync(config.clientSecret, config.clientID, 100000, 1024, "sha512").toString("hex")
module.exports.encrypt = function (data) {
    let cipher = createCipher("aes256", password);
    let encrypt = cipher.update(data, "utf8", "hex")
    encrypt += cipher.final("hex");
    return encrypt
}
module.exports.decrypt = function (data) {
    let decipher = createDecipher("aes256", password)
    let decrypt = decipher.update(data, "hex", "utf8")
    decrypt += decipher.final("utf8")
    return decrypt
}