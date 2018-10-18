module.exports = async (msg, retMsg = false) => {
    try {
        const [resp] = await bot.waitForEvent("messageCreate", 10000, (m) => {
            if (m.author.id != msg.author.id) return false;
            if (m.channel.id != msg.channel.id) return false;
            if (m.content.toLowerCase() != "y" && m.content.toLowerCase() != "yes" && m.content.toLowerCase() != "n" && m.content.toLowerCase() != "no") return false;
            return true;
        });
        if (resp.content.toLowerCase() === "y" || resp.content.toLowerCase() === "yes") return retMsg ? {
            response: true,
            msg: resp
        } : true;
        else return retMsg ? {
            response: false,
            msg: resp
        } : true;
    } catch (_) {
        return retMsg ? {
            response: false,
            msg: null
        } : false;
    }
};