var Discordie = require("discordie");
var Events = Discordie.Events;

var client = new Discordie();
  var prefix = "TTBot-"
client.connect({ token: "MTk4MDc2MTQ1NDExOTQ4NTQ0.CrW2MA.otQqrUt0UEJ1bHO_VkTgmmdRrDQ" });

client.Dispatcher.on(Events.GATEWAY_READY, e => {
  console.log("Connected as: " + client.User.username);
  console.log("The bot is currently in " + client.Guilds.length + " servers, with " + client.Users.length + " users.");
  console.log("The server list is:\n");
  console.log(client.Guilds.toArray())
  setGame(prefix + "help | Actually on " + client.Guilds.length + " servers with " + client.Users.length + " users");
  client.autoReconnect.enable();
});

client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
  if (e.message.isPrivate) console.log("[" + e.message.author.username + "]" + e.message.resolveContent());
if (!e.message.isPrivate) {
 const role = e.message.guild.roles.find(r => r.name === "TTtie Bot SU")
 if (role && e.message.member.hasRole(role)) {
 if (e.message.content == prefix +"rolesystemping") {
     e.message.channel.sendMessage(e.message.author.nickMention + ", it works ofc");
 } else if (e.message.content.match(prefix + "setnick")) {
var word = e.message.content.split(" ");
if (word[0] == prefix + "setnick") {
  var nick = e.message.content.slice(14,48);
client.User.memberOf(e.message.guild).setNickname(nick);
} 
} else if (e.message.content.match(prefix + "ban")) {
  var word = e.message.content.split(" ");
  console.log(word);
  console.log(word[0]);
  if (word[0] == prefix + "ban") { 
    const banUser = e.message.guild.members.find(bu => bu.name === e.message.content.slice(10,42))
      if (e.message.content.slice(10,42) == "TTtie Bot") {
        e.message.channel.sendMessage(e.message.author.nickMention + ", **nope.**")
      } else {
    e.message.guild.ban(banUser);
    e.message.channel.sendMessage(e.message.author.nickMention + ", tried to ban " + e.message.content.slice(5,37));
      }
  }
} else if  (e.message.content == prefix + "help") {
    e.message.channel.sendMessage(e.message.author.nickMention + ", List of TTtie Bot SU commands:\n" + prefix +"setnick <nick> - Set the bot's nick.\n" + prefix +"ban - ban a user by nickname(If not set, by username).")
}
} 

 if (e.message.guild.id == 199809229710819328) {
  if (e.message.content == prefix + "help") {
      e.message.channel.sendMessage(e.message.author.nickMention + ", Here is the command list: \n" + prefix +"aboutserver - Shows info about server!\n" + prefix + "rules - shows here to read rules.\n" + prefix + "subscribe - Subscribe to xSF!\n" + prefix +"website - Show xSF website\n" + prefix + "disneyxd - show link to Disney XD.");
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
if (e.message.guild.id == 195865382039453697) {
if (e.message.content == prefix + "help") {
  e.message.channel.sendMessage(e.message.author.nickMention + ", Here is the command list: \n" + prefix + "help - gives you this help.\n" + prefix + "website - gives you a link to my website\n" + prefix + "subscribe - Subscribe to my channel!\n" + prefix + "rules - Check where are the rules!");
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
    setGame(prefix + "help | Actually on " + client.Guilds.length + " servers with " + client.Users.length + " users");
if (e.message.content == prefix + "aboutbot") {
  e.message.channel.sendMessage(e.message.author.nickMention + "\n**TTtie Bot**\nBuild **122**\nMade by **TTtie** using **Discordie(Node.js)**\nDebugging information:\n```xl\nPath to the bot's Javascript file: " + __filename + "\nUptime(in seconds): " + Math.round(process.uptime()) + "```");
} else if (e.message.content == prefix + "aboutme") {
  e.message.channel.sendMessage(e.message.author.nickMention + "\n" +"Username: "+ e.message.author.username + "\n" + "Nickname: " + e.message.author.memberOf(e.message.guild).nick + "\n" + "Discriminator: " + e.message.author.discriminator + "\n" + "Registered at: (Bot's local timezone applies) " + e.message.author.registeredAt + "\n" + "Avatar URL: " + e.message.author.avatarURL + "\n" + "Is a bot user: " + e.message.author.bot + "\nID: " + e.message.author.id + "\nJoined the server: " + e.message.author.memberOf(e.message.guild).joined_at);
} else if (e.message.content == prefix + "help") {
    e.message.channel.sendMessage(e.message.author.nickMention + ",Here is the general command list:\n"+ prefix +"aboutbot - Prints information about bot\n"+ prefix + "aboutme - Prints information about you.\n" + prefix+ "ping - Use to test bot's responsiveness!\n" + prefix + "invite - Invite me to your server\n" + prefix + "feature <feature request> - request your features!\n" + prefix + "hi - gives you a greeting\n" + prefix + "customcommands - Get a link to request your custom commands\n" + prefix +"botsrc - Build your own bot from this code!\n"+ prefix + "serverinfo - get info about the server!\n" + prefix + "actualbottime - show up the actual bot's time.\n" + prefix + "cat - gives you a random cat picture");
    console.log(e.message.author);
    console.log("executed command .help");
} else if (e.message.content == prefix + "hi") {
    e.message.channel.sendMessage("Hey, " + e.message.author.nickMention);
    console.log(e.message.author);
    console.log("executed command .hi");
  } else if (e.message.content == prefix + "ping") {
  e.message.channel.sendMessage(e.message.author.nickMention + ", It works!")
} else if (e.message.content == prefix + "invite") {
  e.message.channel.sendMessage(e.message.author.nickMention + ", Invite me to your server: https://discordapp.com/oauth2/authorize?scope=bot&client_id=195506253806436353&permissions=8")
} else if (e.message.content.match(prefix +"feature")) {
  var word = e.message.content.split(" ");
  if (word[0] == prefix + "feature") {
    var feature = e.message.content.slice(14);
    if (feature == null || feature == undefined) {
      e.message.channel.sendMessage(e.message.author.nickMention + ", You just requested nothing.")
    } else {
      console.log("New feature request: " + feature);
    }
}
} else if (e.message.content == prefix + "customcommands") {
  e.message.channel.sendMessage(e.message.author.nickMention + ", Send the custom command request here: https://discord.gg/HFax3Mp\nFormat:\nServer instant invite\ncommand | function (Do this multiple times if you want more custom commands)");

} else if (e.message.content == prefix + "botsrc") {
  e.message.channel.sendMessage(e.message.author.nickMention + ", The Git source is being prepared");
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
}
 
if (e.message.author.id == 150628341316059136) {
  if(e.message.content == prefix + "disconnect") {
    client.disconnect();
  } else if (e.message.content == prefix + "reconnect") {
    client.disconnect();
    client.connect({ token: "MTk4MDc2MTQ1NDExOTQ4NTQ0.CnZnPw.y6VQTH3FWD8WkOQT1jgq2XtoY7g" }); 
  } else if (e.message.content == prefix + "removebot") {
    e.message.guild.leave();
  } else if (e.message.content.match(prefix + "setnick")) {
var word = e.message.content.split(" ");
if (word[0] == prefix + "setnick") {
  var nick = e.message.content.slice(14,48);
client.User.memberOf(e.message.guild).setNickname(nick);
} 
} else if (e.message.content.match(prefix + "eval")) {
    var splittext = e.message.content.split(" ");
    console.log(splittext);
    if (splittext[0] == prefix + "eval") {
      var sliced = e.message.content.slice(11);
      console.log(sliced);
      var runned = eval(sliced);
      console.log(runned);
e.message.channel.sendMessage(runned);
    }
  } else if (e.message.content == prefix + "help") {
    e.message.channel.sendMessage(e.message.author.nickMention + ", Check the console.");
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
  }}
}
);
client.Dispatcher.on(Events.GUILD_MEMBER_ADD, gma => {
  if (gma.guild.id != 110373943822540800) {
gma.guild.generalChannel.sendMessage(gma.member.nickMention + " has joined **" + gma.guild.name + "**.");}
console.log(gma.member.username + " joined " + gma.guild.name);
});
client.Dispatcher.on(Events.GUILD_MEMBER_REMOVE, gmr => {
  if (gmr.guild.id != 110373943822540800) {
gmr.guild.generalChannel.sendMessage(gmr.user.username + " left **" + gmr.guild.name + "**.");
  }
console.log(gmr.user.username + " left " + gmr.guild.name);
});
client.Dispatcher.on(Events.GUILD_CREATE, gcr => {
  gcr.guild.generalChannel.sendMessage("Thanks for adding **TTtie Bot** to this server!\nPlease set up the TTtie Bot SU role for more experience!(It's not required)");
  console.log("New server: " + gcr.guild.name);
});
client.Dispatcher.on(Events.GUILD_DELETE, gdl => {
  console.log("Bot got removed from guild with ID " + gdl.guildId);
});
client.Dispatcher.on(Events.GUILD_BAN_ADD, gba => {
  if (gba.guild.id != 110373943822540800) {
gba.guild.generalChannel.sendMessage(gba.user.username + " got banned from **" + gba.guild.name + "**.");}
console.log(gba.user.username + " got banned from " + gba.guild.name);}
);
client.Dispatcher.on(Events.GUILD_BAN_REMOVE, gbr => {
if (gbr.guild.id != 110373943822540800){
  gbr.guild.generalChannel.sendMessage(gbr.user.username + " got unbanned from **" + gbr.guild.name + "**.");}
console.log(gbr.user.username + " got unbanned from " + gbr.guild.name);

});
function setGame(name) {
  var game = {type: 1, name: name, url: "http://twitch.tv/tttie_tt"};
  client.User.setGame(game);
}
