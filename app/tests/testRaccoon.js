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
raccoon.connect(redisURL.port, redisURL.hostname, redisURL.auth.split(":")[1]);

// var getErrorMessage = function(err) {
//     if (err.errors) {
//         for (var errName in err.errors) {
//             if (err.errors[errName].message) return err.errors[errName].message;
//         }
//     } else {
//         return 'Unknown server error';
//     }
// };
//     client.flushdb();

// raccoon.liked('garyId', 'movieId');
   // raccoon.liked('garyId', 'movie2Id');
   raccoon.liked('chrisId', 'movieId');

// client.smembers('movie:garyId:liked', function(err, results) {
//     if(err){
//         console.log(getErrorMessage(err));
//     }
//     else
//     	console.log('req.user._id liked:' + results[0]);
//     // res.redirect('/api/articles');
// });
// Ask for recommendations:

// raccoon.recommendFor('chrisId', 10, function(results) {
//     // results will be an array of x ranked recommendations for chris
//     // in this case it would contain movie2
//     console.log(results[0]);
// });
// client.end();//forcibly close the connection
// client.quit();//exit cleanly