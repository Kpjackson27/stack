var url = require('url'),
    redis = require('redis');
var redisURL = url.parse('redis://rediscloud:4kmgVo8PXPmJzJWH@pub-redis-17622.us-east-1-4.5.ec2.garantiadata.com:17622');
// var client = redis.createClient(redisURL.port, redisURL.hostname, {
//     no_ready_check: true
// });
// client.auth(redisURL.auth.split(":")[1]);
// client.on("error", function(err) {
//     console.log("Error " + err);
// });

var raccoon = require('raccoon');
raccoon.connect(6379, '127.0.0.1'); //local
// raccoon.connect(redisURL.port, redisURL.hostname, redisURL.auth.split(":")[1]);


raccoon.liked('r1', '1', function() {
    raccoon.liked('r1', 'leisure', function() {
        raccoon.liked('r2', '1', function() {});
    });
});
//ask recommended movie for andre
// raccoon.recommendFor('r2', 5, function(recs) {
//     console.log(recs);
//     console.log(recs[0]); //should be batman
// });