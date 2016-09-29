/* This is the TTtie Bot source code. 
The bot requires Discordie.*/

var Discordie = require("discordie");
var Events = Discordie.Events;

var client = new Discordie();
  var prefix = "."; // prefix, this will be what you will want to start command with.
                    // For example, the prefix - will have commands -help etc.
  var token = ""; // place the token in the double quotes
  var ownerid = ""; // place your id in the double quotes, if you don't know the
                    // id, get into my server(https://tttie.ga/redir.php?dst=dskrd) and type TTBot-aboutme
var adminRoleName = ""; // place the admin role name here. 
client.connect({ token: token });

client.Dispatcher.on(Events.GATEWAY_READY, e => {
  console.log("Connected as: " + client.User.username);
  console.log("The bot is currently in " + client.Guilds.length + " servers, with " + client.Users.length + " users.");
  setGame(prefix + "help | Actually on " + client.Guilds.length + " servers with " + client.Users.length + " users");
  client.autoReconnect.enable();
});

client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
if (!e.message.isPrivate){
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
    const banUser = e.message.guild.members.find(bu => bu.name === e.message.content.slice(10,42))
      if (e.message.content.slice(10,42) == client.User.username || e.message.content.slice(10,42) == client.User.memberOf(e.message.guild).name) {
        e.message.channel.sendMessage(e.message.author.nickMention + ", **nope.**")
      } else {
    e.message.guild.ban(banUser);
    e.message.channel.sendMessage(e.message.author.nickMention + ", tried to ban " + e.message.content.slice(5,37));
      }
  }
  } else if  (e.message.content == prefix + "help") {
    e.message.channel.sendMessage(e.message.author.nickMention + ", List of " + adminRoleName + " commands:\n.setnick <nick> - Set the bot's nick.\n.ban - ban a user by ID.")
}}
/* 
if (e.message.guild.id == <guild id>) {
     // some commands here
}
This is used to have custom commands for other servers
*/

}

    setGame(prefix + "help | Actually on " + client.Guilds.length + " servers with " + client.Users.length + " users");
 // some commands here
/*To make commands, use this syntax:
if (e.message.content == prefix + "cmdname") {
  e.message.channel.sendMessage("command text");
  // For the first command
} else if (e.message.content == prefix + "cmd2") {
  e.message.channel.sendMessage("cmd2 text");
  //For the next commands
}
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

client.Dispatcher.on(Events.GUILD_MEMBER_ADD, gma => {
//this runs if someone joins a server.
gma.guild.generalChannel.sendMessage(gma.member.nickMention + " has joined **" + gma.guild.name + "**.");
console.log(gma.member.username + " joined " + gma.guild.name);
});
client.Dispatcher.on(Events.GUILD_MEMBER_REMOVE, gmr => {
//this runs if someone leaves the server.
gmr.guild.generalChannel.sendMessage(gmr.user.username + " left **" + gmr.guild.name + "**.");
  
console.log(gmr.user.username + " left " + gmr.guild.name);
});
/* 
client.Dispatcher.on(Events.GUILD_CREATE, gcr => {
  // this will run if the bot joined a server, disabled by default, uncomment this block to enable it
  gcr.guild.generalChannel.sendMessage("Thanks for adding **TTtie Bot** to this server!\nPlease set up the TTtie Bot SU role for more experience!(It's not required)");
  console.log("New server: " + gcr.guild.name);
});*/
client.Dispatcher.on(Events.GUILD_DELETE, gdl => {
  console.log("Bot got removed from guild with ID " + gdl.guildId);
});
/*
client.Dispatcher.on(Events.GUILD_BAN_ADD, gba => {
 // this will run if someone is banned from a server, disabled by default, uncomment this block to enable it
gba.guild.generalChannel.sendMessage(gba.user.username + " got banned from **" + gba.guild.name + "**.");
console.log(gba.user.username + " got banned from " + gba.guild.name);}
);*/
/*
client.Dispatcher.on(Events.GUILD_BAN_REMOVE, gbr => {
// this will run if someone is unbanned from a server, disabled by default, uncomment this block to enable it
  gbr.guild.generalChannel.sendMessage(gbr.user.username + " got unbanned from **" + gbr.guild.name + "**.");
console.log(gbr.user.username + " got unbanned from " + gbr.guild.name);

});*/
// the setGame function is meant to set game.
function setGame(name) {
  /* 
  //To set the bot's streaming game, uncomment this code and comment the playing game.
    var game = {type: 1, name: name, url: ""};
    url MUST be a valid twitch url
  */
  // playing game
  var game = {name: name};
  //playing game end
  client.User.setGame(game);
} 
