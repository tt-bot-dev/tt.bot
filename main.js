module.exports.runBot = function(shardId, shardCount, token){
var fs = require("fs")
var Discordie = require("discordie");
var Events = Discordie.Events;
var Cleverbot = require('cleverbot-node');
var client = new Discordie({shardId: shardId, shardCount: shardCount});

  var prefix = "TTBot-"
client.connect({ token: token });
var streaming = 0;
var logChannelName = "ttbot-logs";
client.Dispatcher.on(Events.GATEWAY_READY, e => {

  dbots()
  console.log("Connected as: " + client.User.username);
  console.log("The bot is currently in " + client.Guilds.length + " servers, with " + client.Users.length + " users.");
  setGame();
  client.autoReconnect.enable();
  require("./httpthings.js").runWebServer(4000 + shardId,shardId)
});

client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
  try {
setGame();
function checkStatus() {
  var status = e.message.author.status;
  if (status == "online") {
    return "Online";
  } else if (status == "idle") {
    return "Idle";
  } else if (status == "dnd") {
    return "Do Not Disturb";
  } else if (status == "offline") {
    return "Offline/Invisible";
  }
}
function ping() {
e.message.channel.sendMessage(`${e.message.author.mention}, works!`).then(sentMessage => {
sentMessage.edit(`${sentMessage.content} | ${Date.parse(sentMessage.timestamp) - Date.parse(e.message.timestamp)}ms`);
});
}
if (e.message.isPrivate && e.message.author != client.User) console.log("[" + e.message.author.username + "] " + e.message.resolveContent());
if (!e.message.isPrivate) {
 const role = e.message.guild.roles.find(r => r.name === "TTtie Bot SU")
 if (role && e.message.member.hasRole(role)) {
 if (e.message.content == prefix +"rolesystemping") {
     e.message.channel.sendMessage(e.message.author.nickMention + ", it works ofc");
 } else if (e.message.content.startsWith(prefix + "setnick")) {

if (e.message.content != prefix + "setnick") {
  var nick = e.message.content.slice(14,48);
if (nick == "-r") {
  client.User.memberOf(e.message.guild).setNickname("");
}
if (nick != "-r") {
client.User.memberOf(e.message.guild).setNickname(nick);
}
} else {
e.message.channel.sendMessage(e.message.author.nickMention + ", Invalid or missing arguments.\nCorrect usage: `"+prefix+"setnick <nick/-r to reset>`")
}
} else if (e.message.content.startsWith(prefix + "ban")) {
  if (e.message.content != prefix + "ban") {
    const banUser = e.message.guild.members.find(bu => bu.name === e.message.content.slice(10,42))
      if (e.message.content.slice(10,42) == client.User.memberOf(e.message.guild).name) {
        e.message.channel.sendMessage(e.message.author.nickMention + ", **nope.**")
      } else {
    e.message.guild.ban(banUser);
    e.message.channel.sendMessage(e.message.author.nickMention + ", tried to ban " + e.message.content.slice(10,42));
    if (e.message.guild.id == 195865382039453697) {
      e.message.channel.sendMessage("w!reason latest Banned by " + e.message.member.username +"#" +e.message.member.discriminator)
    }
      }
  }else {
e.message.channel.sendMessage(e.message.author.nickMention + ", Invalid or missing arguments.\nCorrect usage: `"+prefix+"ban <user>`")
}
} else if  (e.message.content == prefix + "help") {
    e.message.channel.sendMessage(e.message.author.nickMention + " ```xl\nTTtie Bot SU:\n" + prefix +"setnick <nick>\n" + prefix +"ban <username/nickname>\n" + prefix + "assignrole <role> to <user>\n" + prefix + "unassignrole <role> from <user>\n"+prefix +"kick <user>\n" + prefix +"clear <msg count, max 100>\n"+ prefix +"softban <user>\n<user> = nickname, if not set, username\nNote:This might confuse with other users, so if\nsomeone impersonates people, please rename him to any nick\nof your choice.```")
} else if (e.message.content.startsWith(prefix + "assignrole")) {
  if (e.message.content != prefix + "assignrole") {
    var slice2 = e.message.content.slice(17);
    var split = slice2.split(" to ");
    console.log(split);
    console.log(slice2)
    var member = e.message.guild.members.find(m => m.name === split[1]);
    var roleAssigned = e.message.guild.roles.find(r => r.name === split[0]);
    if (member && roleAssigned && !member.hasRole(roleAssigned)){
      member.assignRole(roleAssigned);
      e.message.channel.sendMessage(e.message.author.nickMention + ", Attempted to give " + split[0] + " role to " + split[1]);
    }

  }else {
e.message.channel.sendMessage(e.message.author.nickMention + ", Invalid or missing arguments.\nCorrect usage: `"+prefix+"assignrole <role> to <user>`")
} 
}  else if (e.message.content.startsWith(prefix + "unassignrole")) {
  if (e.message.content != prefix + "unassignrole") {
    var slice2 = e.message.content.slice(19);
    var split = slice2.split(" from ");
    console.log(split);
    console.log(slice2)
    var member = e.message.guild.members.find(m => m.name === split[1]);
    var roleAssigned = e.message.guild.roles.find(r => r.name === split[0]);
    if (member && roleAssigned && member.hasRole(roleAssigned)){
      member.unassignRole(roleAssigned);
      e.message.channel.sendMessage(e.message.author.nickMention + ", Attempted to take " + split[0] + " role from " + split[1]);
    }

  } else {
e.message.channel.sendMessage(e.message.author.nickMention + ", Invalid or missing arguments.\nCorrect usage: `"+prefix+"unassignrole <role> from <user>`")
}
}else if (e.message.content.startsWith(prefix + "kick")) {

  if (e.message.content != prefix + "kick") {
    var slice2 = e.message.content.slice(11);
    console.log(split);
    console.log(slice2)
    var member = e.message.guild.members.find(m => m.name === slice2);
    if (member && member != client.User.memberOf(e.message.guild)){
      member.kick();
      e.message.channel.sendMessage(e.message.author.nickMention + ", Attempted to kick " + slice2);
    }

  } else {
e.message.channel.sendMessage(e.message.author.nickMention + ", Invalid or missing arguments.\nCorrect usage: `"+prefix+"kick <user>`")
}
} else if (e.message.content.startsWith(prefix + "clear")) {
  if (e.message.content != prefix + "clear") {
var slice2 = e.message.content.slice(12);
        e.message.channel.fetchMessages(slice2).then(fetched => {
            client.Messages.deleteMessages(fetched.messages);
        }).catch(console.log);
  } else {
e.message.channel.sendMessage(e.message.author.nickMention + ", Invalid or missing arguments.\nCorrect usage: `"+prefix+"clear <msg count,max 100>`")
}
} else if (e.message.content.startsWith(prefix + "softban")) {
  if (e.message.content != prefix + "softban") {
    const banUser = e.message.guild.members.find(bu => bu.name === e.message.content.slice(14,46))
      if (e.message.content.slice(14,46) == "TTtie Bot") {
        e.message.channel.sendMessage(e.message.author.nickMention + ", **nope.**")
      } else {
    e.message.guild.ban(banUser,1);
    e.message.guild.unban(banUser);
    e.message.channel.sendMessage(e.message.author.nickMention + ", tried to softban " + e.message.content.slice(14,46));
        if (e.message.guild.id == 195865382039453697) {
      e.message.channel.sendMessage("w!reason latest Softbanned by " + e.message.member.username +"#" +e.message.member.discriminator)
    }
      }
  } else {
e.message.channel.sendMessage(e.message.author.nickMention + ", Invalid or missing arguments.\nCorrect usage: `"+prefix+"softban <user>`")
}
}
}
 if (e.message.guild.id == 199809229710819328) {
  if (e.message.content == prefix + "help") {
      e.message.channel.sendMessage(e.message.author.nickMention + " ```xl\nxSolidFigure: \n" + prefix +"aboutserver\n" + prefix + "rules\n" + prefix + "subscribe\n" + prefix +"website\n" + prefix + "disneyxd```");
console.log(e.message.author);
console.log("executed command .help")
    } else if (e.message.content == prefix + "aboutserver") {
        e.message.channel.sendMessage(e.message.author.nickMention + "\nxSolidFigure\'s Discord server is where you can chat with your friends, and have fun!");
    } else if (e.message.content == prefix + "rules") {
      e.message.channel.sendMessage(e.message.author.nickMention + "\n#rules is the place where you can read rules!");
    } else if (e.message.content == prefix + "subscribe") {
      e.message.channel.sendMessage(e.message.author.nickMention + "\nSubscribe to xSolidFigure:\nhttps://www.youtube.com/c/XsolidfigureGa");
    } else if (e.message.content == prefix + "website") {
      e.message.channel.sendMessage(e.message.author.nickMention + "\nVisit xSolidFigure.ga: http://xsolidfigure.ga");
    } else if (e.message.content == prefix + "disneyxd") {
      e.message.channel.sendMessage(e.message.author.nickMention + " https://www.youtube.com/user/disneyxd")
    }
  }
if (e.message.guild.id == 110373943822540800) {
if (e.message.content == prefix + "testing") {
e.message.channel.sendMessage(e.message.author.nickMention + ", Here: <#119222314964353025>, <#117018340114825217>, <#113743192305827841>, <#132632676225122304>, <#116705171312082950>")
} else if (e.message.content == prefix + "help") {
  e.message.channel.sendMessage(e.message.author.nickMention + "```xl\nDiscord Bots: \n" + prefix + "help\n" + prefix + "testing\n```");
}
}
if (e.message.guild.id == 195865382039453697) {
if (e.message.content == prefix + "help") {
  e.message.channel.sendMessage(e.message.author.nickMention + "```xl\nTTtie: \n" + prefix + "help\n" + prefix + "website\n" + prefix + "subscribe\n" + prefix + "rules```");
    console.log(e.message.author);
    console.log("executed command .help");
} else if (e.message.content == prefix + "website"){
  e.message.channel.sendMessage(e.message.author.nickMention + ", This is the link to my website: https://tttie.ga");
    console.log(e.message.author);
    console.log("executed command !website");
} else if (e.message.content == prefix + "subscribe") {
  e.message.channel.sendMessage(e.message.author.nickMention + ", here is the link to my channel: https://www.youtube.com/channel/UCEbJ0s8QXdcTgIFB2TVIpmQ");
} else if (e.message.content == prefix + "rules") {
  e.message.channel.sendMessage(e.message.author.nickMention + ", Check #rules and #punishments for the rules!");
}
}
};
if (e.message.content == prefix + "aboutbot") {
  e.message.channel.sendMessage(e.message.author.nickMention + "\n**TTtie Bot**\nBuild **196**\nMade by **TTtie#4719** using **Discordie(Node.js)**\nDebugging information:\n```xl\nPath to the bot's Javascript file: " + __filename + "\nUptime(in seconds): " + Math.round(process.uptime()) + "```");
} else if (e.message.content == prefix + "aboutme") {
  e.message.channel.sendMessage(e.message.author.nickMention + "\n" +"Username: "+ e.message.author.username + "\n" + "Nickname: " + e.message.author.nickMention + "\n" + "Discriminator: " + e.message.author.discriminator + "\n" + "Registered at: (Bot's local timezone applies) " + e.message.author.registeredAt + "\n" + "Avatar URL: " + e.message.author.avatarURL + "\n" + "Is a bot user: " + e.message.author.bot + "\nID: " + e.message.author.id + "\nStatus: " + checkStatus());
} else if (e.message.content == prefix + "help") {
    e.message.channel.sendMessage(e.message.author.nickMention + "```xl\nGeneral: \n"+ prefix +"aboutbot\n"+ prefix + "aboutme\n" + prefix+ "ping\n" + prefix + "invite\n" + prefix + "feature <feature request>\n" + prefix + "hi\n" + prefix + "customcommands\n" + prefix +"botsrc\n"+ prefix + "serverinfo\n" + prefix + "actualbottime\n" + prefix + "cat\n"+ prefix + "pong\n"+prefix+"say <text>\n"+prefix+"rnd <number>\n"+prefix+"8ball <text>\n"+prefix+"cb <text>\n"+prefix+"dog\nFor music commands, type\n"+prefix+"musichelp. The music commands\naren't case sensitive```");
    console.log(e.message.author);
    console.log("executed command .help");
} else if (e.message.content == prefix + "hi") {
    e.message.channel.sendMessage("Hey, " + e.message.author.nickMention);
    console.log(e.message.author);
    console.log("executed command .hi");
  } else if (e.message.content == prefix + "ping") {
ping();
} else if (e.message.content == prefix + "pong"){
  ping();
} else if (e.message.content == prefix + "invite") {
  e.message.channel.sendMessage(e.message.author.nickMention + ", Invite me to your server: https://discordapp.com/oauth2/authorize?scope=bot&client_id=195506253806436353&permissions=8")
} else if (e.message.content.startsWith(prefix +"feature")) {
  if (e.message.content != prefix + "feature") {
    var feature = e.message.content.slice(14);
      client.Users.find(fn => fn.id == 150628341316059136).openDM().then(dm => { dm.sendMessage(`New feature request by **${e.message.author.username}#${e.message.author.discriminator}** (${e.message.author.id})\n\
from channel ${e.message.channel.name} (${e.message.channel.id}) at ${e.message.guild.name} (${e.message.guild.id}): \n\
${feature}`);
})
    } else {
e.message.channel.sendMessage(e.message.author.nickMention + ", Invalid or missing arguments.\nCorrect usage: `"+prefix+"feature <feature request>`")
}
} else if (e.message.content == prefix + "customcommands") {
  e.message.channel.sendMessage(e.message.author.nickMention + ", Send the custom command request here: https://discord.gg/HFax3Mp\nFormat:\nServer instant invite\ncommand | function (Do this multiple times if you want more custom commands)");

} else if (e.message.content == prefix + "botsrc") {
  e.message.channel.sendMessage(e.message.author.nickMention + ", The source code is here: https://github.com/TTtie/TTtie-Bot");
} else if (e.message.content == "nope.avi") {
  e.message.channel.sendMessage(e.message.author.nickMention + " https://www.youtube.com/watch?v=gvdf5n-zI14");
} else if (e.message.content == prefix + "serverinfo"){
  if (!e.message.isPrivate) e.message.channel.sendMessage(e.message.author.nickMention + "\nServer information for **" + e.message.guild.name + "**:\nID: " + e.message.guild.id + "\nOwner: " + e.message.guild.owner.username + "\nCreated at: "+ e.message.guild.createdAt + "\nIcon: " + e.message.guild.iconURL); else e.message.channel.sendMessage(e.message.author.nickMention + ", **Error:** Can't get server info in direct messages.");
} else if (e.message.content == prefix + "actualbottime") {
  e.message.channel.sendMessage(e.message.author.nickMention + ", the bot's time is " + Date())
} else if (e.message.content == prefix + "cat") {
  var http = require("http")
var url = 'http://random.cat/meow';

http.get(url, function(res){
    var body = '';

    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
        var fbResponse = JSON.parse(body);
        console.log("Got a response: ", fbResponse.file);
        e.message.channel.sendMessage(e.message.author.nickMention + ", " + fbResponse.file)
    });
}).on('error', function(errCat){
      console.log("Got an error: ", errCat);
      e.message.channel.sendMessage(e.message.author.nickMention + ", Got an error" + errCat);
});
} else if(e.message.content.startsWith(prefix + "say")) {
  if (e.message.content != prefix + "say") {
var slice2 = e.message.content.slice(10);
e.message.channel.sendMessage("​" + slice2)
  }else {
e.message.channel.sendMessage(e.message.author.nickMention + ", Invalid or missing arguments.\nCorrect usage: `"+prefix+"say <text>`")
}
} else if (e.message.content.startsWith(prefix + "rnd")) {

  if (e.message.content != prefix + "rnd") {
var slice2 = e.message.content.slice(10);
try {e.message.channel.sendMessage(Math.floor((Math.random() * slice2) + 1))} catch(err) {e.message.channel.sendMessage(err.message)};
  } else {
e.message.channel.sendMessage(e.message.author.nickMention + ", Invalid or missing arguments.\nCorrect usage: `"+prefix+"rnd <number>`")
}
}else if (e.message.content == prefix + "dog") {
  var http = require("http")
var url = 'http://random.dog/woof';

http.get(url, function(res){
    var body = '';

    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
        var fbResponse = body;
        e.message.channel.sendMessage(e.message.author.nickMention + ", http://random.dog/" + fbResponse)
    });
}).on('error', function(errCat){
      console.log("Got an error: ", errCat);
      e.message.channel.sendMessage(e.message.author.nickMention + ", Got an error" + errCat);
});
}
else if (e.message.content.startsWith(prefix+"8ball")) {
if (e.message.content != prefix + "8ball") {
var responses = new Array();
// first node
responses[0] = "mate, you got this first node. whyyyyyyyyy";
//positive
responses[1] = "It is certain.";
responses[2] = "It is decidedly so.";
responses[3] = "Without a doubt.";
responses[4] = "Yes, definitely.";
responses[5] = "You may rely on it.";
responses[6] = "As I see it, yes.";
responses[7] = "Most likely.";
responses[8] = "Outlook good.";
responses[9] = "Yes.";
responses[10] = "Signs point to yes.";
// neutral
responses[11] = "Reply hazy, try again.";
responses[12] = "Ask again later.";
responses[13] = "Better not tell you now.";
responses[14] = "Can\'t predict now.";
responses[15] = "Concentrate and ask again.";
// negative
responses[16] = "Don\'t count on it.";
responses[17] = "My reply is no.";
responses[18] = "My sources say no.";
responses[19] = "Outlook not so good.";
responses[20] = "Very doubtful.";
var random = Math.floor((Math.random() * responses.length) +1)
e.message.channel.sendMessage(e.message.author.nickMention + ", " +responses[random]);
} else {
e.message.channel.sendMessage(e.message.author.nickMention + ", Invalid or missing arguments.\nCorrect usage: `"+prefix+"8ball <text>`")
}} else if (e.message.content.startsWith(prefix + "cb")) {
  if (e.message.content != prefix + "cb") {
    cleverbot = new Cleverbot();
    var cleverMessage = e.message.content.slice(9);
        Cleverbot.prepare(function(){
      cleverbot.write(cleverMessage, function (response) {
           e.message.channel.sendMessage(e.message.author.nickMention+", " + response.message)
      });
    });
  }else {
e.message.channel.sendMessage(e.message.author.nickMention + ", Invalid or missing arguments.\nCorrect usage: `"+prefix+"cb <text>`")
}
}
if (e.message.author.id == 150628341316059136) {
  if(e.message.content == prefix + "disconnect") {
    client.disconnect();
  } else if (e.message.content == prefix + "reconnect") {
    client.disconnect();
    client.connect({ token: "MTk4MDc2MTQ1NDExOTQ4NTQ0.CnZnPw.y6VQTH3FWD8WkOQT1jgq2XtoY7g" });
  } else if (e.message.content == prefix + "removebot") {
    e.message.guild.leave();
  }  else if (e.message.content.startsWith(prefix + "setnick")) {

if (e.message.content != prefix + "setnick") {
  var nick = e.message.content.slice(14,48);
if (nick == "-r") {
  client.User.memberOf(e.message.guild).setNickname("");
}
if (nick != "-r") {
client.User.memberOf(e.message.guild).setNickname(nick);
}
} else {
e.message.channel.sendMessage(e.message.author.nickMention + ", Invalid or missing arguments.\nCorrect usage: `"+prefix+"setnick <nick/-r>`")
}
} else if (e.message.content.startsWith(prefix + "eval")) {

    if (e.message.content != prefix + "eval") {
      var sliced = e.message.content.slice(11);
      console.log(sliced);
try {
var evaluated = eval(sliced);
console.log(evaluated);
e.message.channel.sendMessage("Input:\n```js\n" + sliced + "```\nOutput:\n```js\n" + evaluated + "\n```")
}catch(err){
console.log("An error occurred while using eval:" + err.message)
e.message.channel.sendMessage("Error:\n```xl\n" + err.message + "\n```")
}
    }else {
e.message.channel.sendMessage(e.message.author.nickMention + ", Invalid or missing arguments.\nCorrect usage: `"+prefix+"eval <js>`")
}
  } else if (e.message.content == prefix + "help") {
    e.message.channel.sendMessage(e.message.author.nickMention + "```xl\nOwner:\n" + prefix + "disconnect\n" + prefix + "reconnect\n" + prefix + "removebot\n" + prefix + "setnick\n" + prefix + "privilege\n" + prefix + "unprivilege\n" + prefix + "sendtype\n" + prefix + "gibebotrole\n" + prefix+ "eval <JAVASCRIPT>\n"+prefix+"shell <shellcmd>```");
    console.log("Debug commands:\n.disconnect\n.reconnect\n.removebot\n.setnick");
  } else if (e.message.content == prefix + "privilege") {
e.message.guild.createRole().then(role => {
  var perms = role.permissions;
  perms.General.ADMINISTRATOR = true;

  var newRoleName = "TTtieBotTemp";
  var color = null;
  var hoist = false; // display as separate group

  role.commit(newRoleName, color, hoist);
  console.log(role.position);

  e.message.member.assignRole(role);
}).catch(err => console.log("Failed to create role:", err));
  }else if (e.message.content == prefix + "unprivilege"){
    const TTtieBotTemp = e.message.guild.roles.find(r => r.name === "TTtieBotTemp");
    if (TTtieBotTemp) { e.message.member.unassignRole(TTtieBotTemp);
    TTtieBotTemp.delete();
    }
  }else if (e.message.content == prefix+ "sendtype"){
    e.message.channel.sendTyping();
  }else if (e.message.content == prefix+"gibebotrole") {
    const botRole = e.message.guild.roles.find(r=> r.name === "TTtie Bot");
    e.message.member.assignRole(botRole)
  }else if (e.message.content.startsWith(prefix + "shell")) {

    if (e.message.content != prefix + "shell") {
      var sliced = e.message.content.slice(12);

const exec = require('child_process').exec;
exec(sliced, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    e.message.channel.sendMessage(`Error:\n\`\`\`xl\n${error}\n\`\`\``)
    return;
  }
e.message.channel.sendMessage(`Input:\n\`\`\`xl\n${sliced}\n\`\`\`\nStdout:\n\`\`\`xl\n${stdout}\n\`\`\`\nStderr: \n \`\`\`xl\n${stderr}\n\`\`\``);
});

    }else {
e.message.channel.sendMessage(e.message.author.nickMention + ", Invalid or missing arguments.\nCorrect usage: `"+prefix+"shell <shellcmd>`")
}
  }}
} catch(err) {
  return;
}
}
);

function setGame() {
    var game = {name: "Type "+ prefix + "help"};
  client.User.setGame(game);
 }

function dbots() {
require('./dbots.js').post(shardId, shardCount, client.Guilds.length)
} 


client.Dispatcher.on(Events.GUILD_MEMBER_ADD, gma => {
  if (gma.guild.id != 110373943822540800 && gma.guild.id != 210320881308663808 && gma.guild.id != 236706075779268609) {
gma.guild.generalChannel.sendMessage(gma.member.nickMention + " has joined **" + gma.guild.name + "**.");} else if (gma.guild.id == 236706075779268609) {
  gma.guild.channels.find(cn => cn.name == "logs").sendMessage(gma.member.nickMention + " has joined **" + gma.guild.name + "**.")
    try{
var logChannel = gma.guild.textChannels.find(fn => fn.name == logChannelName);
if (logChannel)
logChannel.sendMessage(`**${gma.member.username}** joined this server.`)
} catch(err) {
  return;
}
}

console.log(gma.member.username + " joined " + gma.guild.name);
});
client.Dispatcher.on(Events.GUILD_MEMBER_REMOVE, gmr => {
  if (gmr.guild.id != 110373943822540800 && gmr.guild.id != 210320881308663808 && gmr.guild.id != 236706075779268609) {
gmr.guild.generalChannel.sendMessage(gmr.user.username + " left **" + gmr.guild.name + "**.");
  }else if (gmr.guild.id == 236706075779268609) {
  gmr.guild.channels.find(cn => cn.name == "logs").sendMessage(gmr.user.username + " has left **" + gmr.guild.name + "**.")
}
    try{
var logChannel = gmr.guild.textChannels.find(fn => fn.name == logChannelName);
if (logChannel)
logChannel.sendMessage(`**${gmr.user.username}** left this server.`)
} catch(err) {
  return;
}
console.log(gmr.user.username + " left " + gmr.guild.name);
});
client.Dispatcher.on(Events.GUILD_CREATE, gcr => {
  if (!gcr.becameAvailable) {
      try{
var logChannel = client.Guilds.find(gn=> gn.name == "TTtie").textChannels.find(fn => fn.name == logChannelName);
if (logChannel)
logChannel.sendMessage(`New server: **${gcr.guild.name}**`);
} catch(err) {
  return;
}
  gcr.guild.generalChannel.sendMessage("Thanks for adding **TTtie Bot** to this server!\nPlease add the TTtie Bot SU role for mod abuse commands :wink:!(It's not required)");
  console.log("New server: " + gcr.guild.name);
dbots()
}else {
console.log(gcr.guild.name + " recovered from unavailable state.");
      try{
var logChannel = client.Guilds.find(gn=> gn.name == "TTtie").textChannels.find(fn => fn.name == logChannelName);
if (logChannel)
logChannel.sendMessage(`${gcr.guild.name} has been recovered from unavailable state.`);
} catch(err) {
  return;
}
}
});
client.Dispatcher.on(Events.GUILD_DELETE, gdl => {
  console.log("Bot got removed from guild with ID " + gdl.guildId);
dbots()
      try{
var logChannel = client.Guilds.find(gn=> gn.name == "TTtie").textChannels.find(fn => fn.name == logChannelName);
if (logChannel)
logChannel.sendMessage(`Bot got removed from a server with ID ${gdl.guildId}.`);
} catch(err) {
  return;
}
});
client.Dispatcher.on(Events.GUILD_BAN_ADD, gba => {
  if (gba.guild.id != 110373943822540800 && gba.guild.id != 210320881308663808 && gba.guild.id != 236706075779268609) {
gba.guild.generalChannel.sendMessage(gba.user.username + " got banned from **" + gba.guild.name + "**.");}else if (gba.guild.id == 236706075779268609) {
  gba.guild.channels.find(cn => cn.name == "logs").sendMessage(gba.user.username + " got banned from **" + gba.guild.name + "**.")
}
    try{
var logChannel = gba.guild.textChannels.find(fn => fn.name == logChannelName);
if (logChannel)
logChannel.sendMessage(`**${gba.user.username}** got banned from this server.`)
} catch(err) {
  return;
}
console.log(gba.user.username + " got banned from " + gba.guild.name);}
);
client.Dispatcher.on(Events.GUILD_BAN_REMOVE, gbr => {
if (gbr.guild.id != 110373943822540800 && gbr.guild.id != 210320881308663808 && gbr.guild.id != 236706075779268609){
  gbr.guild.generalChannel.sendMessage(gbr.user.username + " got unbanned from **" + gbr.guild.name + "**.");}else if (gbr.guild.id == 236706075779268609) {
  gbr.guild.channels.find(cn => cn.name == "logs").sendMessage(gbr.user.username + " got unbanned from **" + gbr.guild.name + "**.")
}
console.log(gbr.user.username + " got unbanned from " + gbr.guild.name);
    try{
var logChannel = gbr.guild.textChannels.find(fn => fn.name == logChannelName);
if (logChannel)
logChannel.sendMessage(`**${gbr.user.username}** got unbanned from this server.`)
} catch(err) {
  return;
}
});

client.Dispatcher.on(Events.VOICE_CHANNEL_LEAVE, vcl => {
var logChannel = vcl.channel.guild.textChannels.find(fn => fn.name == logChannelName);
if (logChannel)
logChannel.sendMessage(`**${vcl.user.username}** left voice channel **${vcl.channel.name}**.`)
});

client.Dispatcher.on(Events.VOICE_CHANNEL_JOIN, vcj => {
var logChannel = vcj.channel.guild.textChannels.find(fn => fn.name == logChannelName);
if (logChannel)
logChannel.sendMessage(`**${vcj.user.username}** joined voice channel **${vcj.channel.name}**.`)
});
client.Dispatcher.on(Events.VOICE_USER_SELF_MUTE, vusm => {
var logChannel = vusm.channel.guild.textChannels.find(fn => fn.name == logChannelName);
if (vusm.state == true) var mutedHimself = "muted";
else var mutedHimself = "unmuted"
if (logChannel)
logChannel.sendMessage(`**${vusm.user.username}** is voice self muted/unmuted. Muted/unmuted: **${mutedHimself}**`)
});
client.Dispatcher.on(Events.VOICE_USER_SELF_DEAF, vusm => {
var logChannel = vusm.channel.guild.textChannels.find(fn => fn.name == logChannelName);
if (vusm.state == true) var mutedHimself = "deafened";
else var mutedHimself = "undeafened"
if (logChannel)
logChannel.sendMessage(`**${vusm.user.username}** is voice self deafened/undeafened. Muted/unmuted: **${mutedHimself}**`)
});
client.Dispatcher.on(Events.VOICE_USER_MUTE, vusm => {
var logChannel = vusm.channel.guild.textChannels.find(fn => fn.name == logChannelName);
if (vusm.state == true) var mutedHimself = "muted";
else var mutedHimself = "unmuted"
if (logChannel)
logChannel.sendMessage(`**${vusm.user.username}** is voice server muted/unmuted. Muted/unmuted: **${mutedHimself}**`)
});
client.Dispatcher.on(Events.VOICE_USER_DEAF, vusm => {
var logChannel = vusm.channel.guild.textChannels.find(fn => fn.name == logChannelName);
if (vusm.state == true) var mutedHimself = "deafened";
else var mutedHimself = "undeafened"
if (logChannel)
logChannel.sendMessage(`**${vusm.user.username}** is voice server deafened/undeafened. Muted/unmuted: **${mutedHimself}**`)
});
client.Dispatcher.on(Events.MESSAGE_DELETE, md => {
var logChannel = client.Channels.textForGuild(md.message.guild).find(fn => fn.name == logChannelName);
if (md.message != null) var mutedHimself = md.message.content;
else var mutedHimself = "unknown"
if (md.message != null) var channelD = md.message.channel.mention;
else var channelD = "unknown"
if (logChannel)
logChannel.sendMessage(`**${md.message.author.username}**'s message got deleted from ${channelD}: \`\`\`${mutedHimself}\`\`\``)
});
client.Dispatcher.on(Events.MESSAGE_UPDATE, md => {
  try{
if (e.message.author.id != client.User.id){
var logChannel = client.Channels.textForGuild(md.message.guild).find(fn => fn.name == logChannelName);
if (md.message != null) var mutedHimself = md.message.content;
else var mutedHimself = "unknown"
if (md.message != null) var channelD = md.message.channel.mention;
else var channelD = "unknown"
if (logChannel)
logChannel.sendMessage(`**${md.message.author.username}** edited(or his message got (un)pinned) a message in ${channelD}: \`\`\`${mutedHimself}\`\`\``)
}
} catch(err) {
  return;
}
});
client.Dispatcher.on(Events.CHANNEL_CREATE, md => {
  try{
var logChannel = md.channel.guild.textChannels.find(fn => fn.name == logChannelName);
if (logChannel)
logChannel.sendMessage(`A text channel got added: ${md.channel.mention}.`)
} catch(err) {
  return;
}
});
client.Dispatcher.on(Events.CHANNEL_UPDATE, md => {
  try{
var logChannel = md.channel.guild.textChannels.find(fn => fn.name == logChannelName);
if (logChannel)
logChannel.sendMessage(`A text channel got updated: ${md.channel.mention}:\nNew name: #${md.channel.name}\nNew topic: ${md.channel.topic}\nNew position:${md.channel.position}`);
} catch(err) {
  return;
}
});
client.Dispatcher.on(Events.GUILD_ROLE_CREATE, md => {
  try{
var logChannel = md.guild.textChannels.find(fn => fn.name == logChannelName);
if (logChannel)
logChannel.sendMessage(`A role has been added on this server: **${md.role.name}**.`);
} catch(err) {
  return;
}
});
client.Dispatcher.on(Events.GUILD_ROLE_UPDATE, md => {
  try{
var logChannel = md.guild.textChannels.find(fn => fn.name == logChannelName);
if (logChannel)
logChannel.sendMessage(`Role **${md.role.name}** has been updated:\nIs mentionable: ${md.role.mentionable}\nNew position: ${md.role.position}\nIs separate from normal users: ${md.role.hoist}`);
} catch(err) {
  return;
}
});
client.Dispatcher.on(Events.GUILD_ROLE_DELETE, md => {
  try{
var logChannel = md.guild.textChannels.find(fn => fn.name == logChannelName);
if (logChannel)
logChannel.sendMessage(`A role with ID ${md.roleId} got deleted.`);
} catch(err) {
  return;
}
});
client.Dispatcher.on(Events.PRESENCE_UPDATE, md => {
  try{
var logChannel = md.guild.textChannels.find(fn => fn.name == logChannelName);
if (md.member.gameName == md.member.previousGameName && md.member.status == md.member.previousStatus){
if (logChannel && md.member.bot == false)
logChannel.sendMessage(`**${md.member.username}**'s presence has been updated.\n\
New playing game: ${md.member.gameName}\n\
New avatar: ${md.member.avatarURL}`);
}
} catch(err) {
  return;
}
});

client.Dispatcher.on(Events.GUILD_MEMBER_UPDATE, md => {
  try{
var logChannel = md.guild.textChannels.find(fn => fn.name == logChannelName);
var array = [];
md.rolesRemoved.forEach(fe => {
  array.push(fe.name);
})
var array2 = [];
md.rolesAdded.forEach(fe => {
  array2.push(fe.name);
})
function checkNick() {
if (md.previousNick == null) return "none"; else return md.previousNick;
}
if (logChannel)
logChannel.sendMessage(`**${md.member.username}**'s guild presence has been updated.\n\
Previous nickname:${checkNick()}\n\
Roles added: ${array2.toString()}\n\
Roles removed: ${array.toString()}`);
} catch(err) {
  console.log(err)
}
});
}

