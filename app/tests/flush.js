var url = require('url'),
    redis = require('redis');
var redisURL = url.parse('redis://rediscloud:4kmgVo8PXPmJzJWH@pub-redis-17622.us-east-1-4.5.ec2.garantiadata.com:17622');
var client = redis.createClient(redisURL.port, redisURL.hostname, {
    no_ready_check: true
});
client.auth(redisURL.auth.split(":")[1]);
client.on("error", function(err) {
    console.log("Error " + err);
});



// client.set("string key", "string val", redis.print);
// client.hset("hash key", "hashtest 1", "some value", redis.print);
// client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
// client.hkeys("hash key", function(err, replies) {
//     console.log(replies.length + " replies:");
//     replies.forEach(function(reply, i) {
//         console.log("    " + i + ": " + reply);
//     });
//     client.quit();
// });
// client.keys('*', function (err, keys) {
//   if (err) return console.log(err);

//   for(var i = 0, len = keys.length; i < len; i++) {
//     console.log(keys[i]);
//   }
// });  

client.flushdb();
client.quit();