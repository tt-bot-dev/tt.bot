const config = require("../config");
const {pbkdf2Sync, createCipheriv, createDecipheriv} = require("crypto");
const password = pbkdf2Sync(config.clientSecret, config.clientID, 100000, 16, "sha512").toString("hex");
const iv = config.encryptionIv;
module.exports.encrypt = function (data) {
    let cipher = createCipheriv("aes256", password, iv);
    let encrypt = cipher.update(data, "utf8", "hex");
    encrypt += cipher.final("hex");
    return encrypt;
};
module.exports.decrypt = function (data) {
    let decipher = createDecipheriv("aes256", password, iv);
    let decrypt = decipher.update(data, "hex", "utf8");
    decrypt += decipher.final("utf8");
    return decrypt;
};