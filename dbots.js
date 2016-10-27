module.exports.post = function(shards, shardcount, guilds) {
    var https = require('https');
  var authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiIxNTA2MjgzNDEzMTYwNTkxMzYiLCJyYW5kIjo5MTMsImlhdCI6MTQ3MjI5NTcyOX0.zBae9v2jl3FcipGhUfTy9Q82JQfgtTrUGw-gWNrs44k"
  var options = {
  hostname: 'bots.discord.pw',
  path: '/api/bots/198076145411948544/stats',
  method: 'POST',
  headers: {
      'Content-Type': 'application/json',
      'Authorization': authToken
  }
};
var req = https.request(options, function(res) {
  console.log('Status: ' + res.statusCode);
 // console.log('Headers: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (body) {
    console.log('Body: ' + body);
  });
});
req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});
// write data to request body
req.write(`{"shard_id": ${shards}, "shard_count": ${shardcount}, "server_count": ${guilds} }`);
req.end();
}
