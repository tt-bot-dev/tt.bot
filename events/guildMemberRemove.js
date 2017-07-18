module.exports = async function(g, m) {
    let server;
    try {
        server = await db.table("configs").get(g.id).run();
    }catch(err) {
        return;
    }
    if (server && server.farewellChannelId && server.farewellMessage) {
        let channel = g.channels.get(server.farewellChannelId);
        if (channel) channel.createMessage(bot.parseMsg(server.farewellMessage));
        else {
            delete server.greetingChannelId;
            delete server.greetingMessage;
            await db.table("configs").get(g.id).update(server).run();
        }
    } else return;
};
module.exports.isEvent = true;