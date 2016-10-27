module.exports.runWebServer = function(port, shardId) {
var http = require('http');
var fs = require('fs');
var path = require('path');
var dispatch = require("dispatch");
var Discordie = require("discordie");
var Events = Discordie.Events;
var client = new Discordie({shardId: shardId, shardCount: 2});
client.connect({ token: "MTk4MDc2MTQ1NDExOTQ4NTQ0.CrW2MA.otQqrUt0UEJ1bHO_VkTgmmdRrDQ" });
client.Dispatcher.on(Events.GATEWAY_READY, e => {
console.log("Connected to Discord as " + client.User.username)
global.guilds = client.Guilds.length;
global.channels= client.Channels.length;
global.users = client.Users.length;


http.createServer(function (request, response) {


    var filePath = './dashboard' + request.url;
    if (filePath == './dashboard/')
        filePath = './dashboard/index.html';

    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'application/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;      
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.wav':
            contentType = 'audio/wav';
            break;
    }

    fs.readFile(filePath, function(error, content) {

        if (error) {
            if(error.code == 'ENOENT'){
                fs.readFile('./index.html', function(error, content) {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                response.end(); 
            }
        } 
        else {
            response.writeHead(200, { 'Content-Type': contentType });
if (filePath == "./dashboard/index.html") 
response.write("<script>function userUpdate(){var userCount ="+users+"; document.getElementById(\"user_count\").innerHTML = userCount; var guilds = "+guilds+ ";document.getElementById(\"guild_count\").innerHTML = guilds;var channels = "+channels+"; document.getElementById(\"channel_count\").innerHTML = channels}</script>");
            response.end(content, 'utf-8');
        }
    });
    if (request.url == "/disconnect") {
        process.exit(0)
    } else if (request.url.startsWith("/user")) {
        var id = request.url.slice(6);

    response.writeHead(200, {'Content-Type': contentType})
response.write(fs.readFileSync("./dashboard/user.html"))
if (id != 1) {
var userSearch = client.Users.find(fn => fn.id == id);
if (userSearch) {
response.write("<script>function userUpdate(){var userCount =\""+userSearch.username+"\"; document.getElementById(\"user\").innerHTML = userCount; var guilds = \""+userSearch.id+ "\";document.getElementById(\"user_id\").innerHTML = guilds;var channels = \""+userSearch.avatarURL+"\"; document.getElementById(\"avatar\").src = channels;var discrim = \""+userSearch.discriminator+"\"; document.getElementById(\"discriminator\").innerHTML = discrim}</script>");
response.end();
} else if (id == "self") {
            response.write("<script>function userUpdate(){var userCount =\"TTtie Bot\"; document.getElementById(\"user\").innerHTML = userCount; var guilds = \"198076145411948544\";document.getElementById(\"user_id\").innerHTML = guilds;var channels = \"https://cdn.discordapp.com/avatars/198076145411948544/7368dab8948328589f4bcce0037d363e.jpg\"; document.getElementById(\"avatar\").src = channels;var discrim = \"8141\"; document.getElementById(\"discriminator\").innerHTML = discrim}</script>");
response.end();
    }} else {
   response.write("<script>function userUpdate(){var userCount =\"Not found\"; document.getElementById(\"user\").innerHTML = userCount; var guilds = \"N/A\";document.getElementById(\"user_id\").innerHTML = guilds;var channels = null; document.getElementById(\"avatar\").src = channels;var discrim = \"N/A\"; document.getElementById(\"discriminator\").innerHTML = discrim}</script>");
response.end(); 
}
    } else if (id == "1") {

    response.write("<script>function userUpdate(){var userCount =\"Clyde\"; document.getElementById(\"user\").innerHTML = userCount; var guilds = \""+1+ "\";document.getElementById(\"user_id\").innerHTML = guilds;var channels = \"https://discordapp.com/assets/f78426a064bc9dd24847519259bc42af.png\"; document.getElementById(\"avatar\").src = channels;var discrim = \"0000\"; document.getElementById(\"discriminator\").innerHTML = discrim}</script>");
response.end();

    }




}).listen(port);
console.log('Server running at http://127.0.0.1:' + port)
});
}
