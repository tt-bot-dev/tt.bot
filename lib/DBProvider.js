const errString = "Must be implemented by a member class";
class DBProvider {
    constructor(sosamba) {
        this.sosamba = sosamba;
    }

    getGuildConfig(guildID) {
        throw new Error(errString);
    }

    updateGuildConfig(guildID, data) {
        throw new Error(errString);
    }

    getUserProfile(userID) {
        throw new Error(errString);
    }

    updateUserProfile(userID, data) {
        throw new Error(errString);
    }

    getGuildModlog(guildID) {
        throw new Error(errString);
    }
}

module.exports = DBProvider;