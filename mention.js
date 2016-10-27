var Discordie = require("discordie");
var client = new Discordie();
var Events = Discordie.Events;
try {var config = require("./config/mention/config.json")}catch(err){console.log("No config exists")}
client.connect({ token: "mfa.dzRiJHNlD4t6S-m2Jtzkgs20EZyfEE-hQXvHggkyvhrjFJi2MlcO-xnNoArBt8ykdpSi8X2VSXSHCNUEiT7D" });
client.Dispatcher.on(Events.GATEWAY_READY, e => {
  console.log("Connected as: " + client.User.username);
  if (config) console.log("Config file exists!");
});
client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
try {

if (config.mentionLog == "allowed") {
if (client.User.isMentioned(e.message)) {
console.log(e.message.author.username + "#" + e.message.author.discriminator + " has mentioned you.\nContent:\n" + e.message.resolveContent());
}
}
if (config.mentionLog == "allowed") {
if (e.message.isPrivate) {
console.log(e.message.author.username + "#" + e.message.author.discriminator + " has sent you a DM.\nContent:\n" + e.message.resolveContent());
}
}
} catch(err) {
  return;
}
})