let origGuild = null;
const {Collection} = require("eris");
class Guild {
    constructor(guild) {
        this.afkChannelID = guild.afkChannelID;
        this.afkTimeout = guild.afkTimeout;
        this.createdAt = guild.createdAt;
        this.defaultNotifications = guild.defaultNotifications;
        this.emojis = guild.emojis;
        this.explicitContentFilter = guild.explicitContentFilter;
        this.features = guild.features;
        this.icon = guild.icon;
        this.iconURL = guild.iconURL;
        this.id = guild.id;
        this.joinedAt = guild.joinedAt;
        this.large = guild.large;
        this.memberCount = guild.memberCount;
        this.mfaLevel = guild.mfaLevel;
        this.name = guild.name;
        this.ownerID = guild.ownerID;
        // TODO: Guild.owner
        // this.owner = new Member(guild.members.get(guild.ownerID));
        this.splash = guild.splash;
        this.systemChannelID =  guild.systemChannelID;
        this.joinMessageChannelID = this.systemChannelID;
        this.unavailable = guild.unavailable;
        this.verificationLevel = guild.verificationLevel;
    }

    // TODO: Guild.channels, Guild.members and Guild.roles
}
module.exports = Guild;