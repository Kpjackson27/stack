var url = require('url'),
    redis = require('redis');
// var redisURL = url.parse('redis://rediscloud:4kmgVo8PXPmJzJWH@pub-redis-17622.us-east-1-4.5.ec2.garantiadata.com:17622');
// var client = redis.createClient(redisURL.port, redisURL.hostname, {
//     no_ready_check: true
// });
// client.auth(redisURL.auth.split(":")[1]);
// client.on("error", function(err) {
//     console.log("Error " + err);
// });

var raccoon = require('raccoon');
raccoon.connect(6379, '127.0.0.1'); //local

/*
separate callbacks
*/
// raccoon.liked('chris', 'batman', function(){});
// raccoon.liked('larry', 'batman', function(){});
// raccoon.disliked('greg', 'batman', function(){});

/*
nested callbacks
*/
// raccoon.liked('chris', 'batman', function() {
//     raccoon.liked('larry', 'batman', function() {
//         raccoon.disliked('greg', 'batman', function() {});
//     });
// });


raccoon.liked('chris', 'batman', function() {
    raccoon.liked('chris', 'superman', function() {
        raccoon.disliked('chris', 'chipmunks', function() {
            raccoon.liked('max', 'batman', function() {
                raccoon.disliked('max', 'chipmunks', function() {
                    raccoon.liked('greg', 'batman', function() {
                        raccoon.liked('greg', 'superman', function() {
                            raccoon.liked('larry', 'batman', function() {
                                raccoon.liked('larry', 'iceage', function() {
                                    raccoon.disliked('tuhin', 'batman', function() {
                                        raccoon.disliked('tuhin', 'superman', function() {
                                            raccoon.disliked('tuhin', 'chipmunks', function() {
                                                raccoon.disliked('kristina', 'batman', function() {
                                                    raccoon.disliked('kristina', 'superman', function() {
                                                        raccoon.disliked('andre', 'superman', function() {});
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});