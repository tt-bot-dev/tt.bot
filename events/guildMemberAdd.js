module.exports = async function(g, m) {
    let server;
    try {
         server = await db.table("configs").get(g.id).run();
    }catch(err) {
        return;
    }
    if (server && server.greetingChannelId && server.greetingMessage) {
        function formatMessage() {
            return server.greetingMessage.replace(/{u\.mention}/g, m.user.mention)
            .replace(/{g\.name}/g, g.name)
            .replace(/{g\.id}/g, g.id)
            .replace(/{u\.name}/g, m.user.username)
            .replace(/{u\.discrim}/g, m.user.discriminator)
            .replace(/{u\.id}/g, m.user.id)
        }
        let channel = g.channels.get(server.greetingChannelId);
        if (channel) channel.createMessage(formatMessage())
        else {
            delete server.greetingChannelId;
            delete server.greetingMessage;
            await db.table("configs").get(g.id).update(server).run();
        }
    } else return;
}
module.exports.isEvent = true;