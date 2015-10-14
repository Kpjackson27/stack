'use strict';

// var _ = require('lodash'),
//   async = require('async'),
//   crypto = require('crypto'),
//   passport = require('passport'),
//   nodemailer = require('nodemailer'),
//   User = require('../models/User'),
//   Article = require('../models/Article');

//configuration: remote redis
// var url = require('url'),
//     redis = require('redis');
// var redisURL = url.parse('redis://rediscloud:4kmgVo8PXPmJzJWH@pub-redis-17622.us-east-1-4.5.ec2.garantiadata.com:17622');
// var client = redis.createClient(redisURL.port, redisURL.hostname, {
//     no_ready_check: true
// });
// client.auth(redisURL.auth.split(":")[1]);
var raccoon = require('raccoon');
// raccoon.connect(redisURL.port, redisURL.hostname, redisURL.auth.split(":")[1]);

var getErrorMessage = function(err) {
    if (err.errors) {
        for (var errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].message;
        }
    } else {
        return 'Unknown server error';
    }
};
//REST API for like (thumb up) button
exports.like = function(req, res) {
    var article = req.article;
    article._favorites = req.user;
    /*
      save the "LIKE" instance to local mongo db
    */
    article.save(function(err) {
        if (err) {
            req.flash('errors', {
                msg: 'Oops! Failed to like this post.'
            });
        }
        //todo: ajax/socket.io, not to refresh forever
        // res.redirect('/main');
    });
    /*
      Save the "LIKE" instance to local/remote redis 
    */

    // console.log(req.article._id);
    // console.log(req.user._id);

    raccoon.liked( req.user._id, req.article._id, function() {
        // client.smembers('movie:' + req.user._id + ':liked', function(err, results) {
        //     console.log('req.user._id liked:' + results[0]);
        // });
        console.log("redis saved: " + req.user._id+ ' liked: ' + req.article._id);
    });
};
//REST API for dislike (thumb down) button
exports.dislike = function(req, res) {
    /*
      save the "DIS-LIKE" instance to local mongo db
    */
    var article = req.article;
    article._dislikes = req.user;
    article.save(function(err) {
        if (err) {
            req.flash('errors', {
                msg: 'Oops! Failed to dislike this post.'
            });
        }
        //todo: ajax/socket.io, not to refresh forever
        // res.redirect('/api/articles');
    });
    // console.log(req.article._id);
    // console.log(req.user._id);
    /*
      Save the "DIS-LIKE" instance to local/remote redis 
    */
    raccoon.disliked(req.article._id, req.user._id, function() {
        // client.smembers('movie:' + req.user._id + ':disliked', function(err, results) {
        //     console.log('req.user._id disliked:' + results[0]);
        // });
    });
};



// ### Delete Favorite
exports.destroy = function(req, res) {
    var article = req.article;
    article._favorites = req.user;
    article.save(function(err) {
        if (err) return res.send(400);
        res.send(200);
    });
};

exports.recommendFor = function(req, res) {
    // Ask for recommendations for req.user._id
    raccoon.recommendFor(req.user._id, 5, function(recs) {
        console.log('recommendatoins for '+req.user._id +' is: ' + recs);
        res.format({
            html: function() {
                res.render('pages/recommendations', {
                    title: 'Verz | Recommendations',
                    "recs": recs //an array of article/verz/post Id
                });
            },
            json: function() {
                res.json(recs);
            }
        });
    });
};