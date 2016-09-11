/* This is the TTtie Bot source code. 
The bot requires Discordie.*/

var Discordie = require("discordie");
var Events = Discordie.Events;

var client = new Discordie();
  var prefix = "."; // prefix, this will be what you will want to start command with.
                    // For example, the prefix - will have commands -help etc.
  var token = ""; // place the token in the double quotes
  var ownerid = ""; // place your id in the double quotes, if you don't know the
                    // id, get into my server(https://tttie.ga/redir.php?dst=dskrd) and type .aboutme
var adminRoleName = ""; // place the admin role name here. 
client.connect({ token: token });

client.Dispatcher.on(Events.GATEWAY_READY, e => {
  console.log("Connected as: " + client.User.username);
  console.log("The bot is currently in " + client.Guilds.length + " servers, with " + client.Users.length + " users.");
  setGame(prefix + "help | Actually on " + client.Guilds.length + " servers with " + client.Users.length + " users");
  client.autoReconnect.enable();
});

client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
if (!e.message.isPrivate) {
const role = e.message.guild.roles.find(r => r.name === adminRoleName)
if (role && e.message.member.hasRole(role)) {
 if (e.message.content.match(prefix + "setnick")) {
var word = e.message.content.split(" ");
if (word[0] == prefix + "setnick") {
  var nick = e.message.content.slice(9);
client.User.memberOf(e.message.guild).setNickname(nick);
} 
} else if (e.message.content.match(prefix + "ban")) {
  var word = e.message.content.split(" ");
  console.log(word);
  console.log(word[0]);
  console.log(word[1]);
  if (word[0] == prefix + "ban") { 
    if (word[1] == client.User.id) {
      e.message.channel.sendMessage(e.message.author.nickMention + ", **nope.**")
      console.log(e.message.author.username + " tried to ban the bot.")
    } else {
    e.message.guild.ban(word[1]);
    e.message.channel.sendMessage(e.message.author.nickMention + ", tried to ban user with ID " + word[1]);

  }
  }
} else if  (e.message.content == prefix + "help") {
    e.message.channel.sendMessage(e.message.author.nickMention + ", List of " + adminRoleName + "commands:\n.setnick <nick> - Set the bot's nick.\n.ban - ban a user by ID.")
}
} }
    setGame(prefix + "help | Actually on " + client.Guilds.length + " servers with " + client.Users.length + " users");
 // some commands here

/* 
if (e.message.guild.id == <guild id>) {
     // some commands here
}
This is used to have custom commands for other servers
*/
if (e.message.author.id == ownerid) {
  if(e.message.content == prefix + "disconnect") {
    client.disconnect();
  } else if (e.message.content == prefix + "reconnect") {
    client.disconnect();
    client.connect({ token: token }); 
  } else if (e.message.content == prefix + "removebot") {
    e.message.guild.leave();
  } else if (e.message.content.match(prefix + "setnick")) {
var word = e.message.content.split(" ");
if (word[0] == prefix + "setnick") {
  var nick = e.message.content.slice(9);
client.User.memberOf(e.message.guild).setNickname(nick);
} 
} else if (e.message.content == prefix + "help") {
    e.message.channel.sendMessage(e.message.author.nickMention + ", Check the console.");
    console.log("Debug commands:\n.disconnect\n.reconnect\n.removebot\n.setnick");
  }}
}
);
// the setGame function is meant to set game.
function setGame(name) {
  var game = {name: name};
  client.User.setGame(game);
}
