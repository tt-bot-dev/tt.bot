let origBot, origGuild;
// A dummy message object so ESLint doesn't complain
class Message {}
class Client {
    constructor(bot, guild) {
        origBot = bot;
        origGuild = guild;
    }

    get guilds() {
        return origBot.guilds.size
    }

    get users() {
        return origBot.users.size
    }

    waitForMessage(authorId, channelId, timeout, check) {
        if (!authorId || !channelId) return Promise.reject("Missing author/channel ID");
        if (!check || typeof check !== "function") check = () => true;
        let c = msg => {
            if (msg.author.id == authorId && msg.channel.id == channelId
                && msg.channel.guild && msg.channel.guild.id == origGuild.id
                && check()) return true;
            else return false;
        };
        origBot.waitForEvent("messageCreate", timeout, c)
            .then((eventReturn) => new Message(eventReturn[0]));
    }
}
module.exports = Client;