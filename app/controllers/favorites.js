'use strict';

// var _ = require('lodash'),
//   async = require('async'),
//   crypto = require('crypto'),
//   passport = require('passport'),
//   nodemailer = require('nodemailer'),
//   User = require('../models/User'),
//   Article = require('../models/Article');
var url = require('url'),
    redis = require('redis');
var redisURL = url.parse('redis://rediscloud:4kmgVo8PXPmJzJWH@pub-redis-17622.us-east-1-4.5.ec2.garantiadata.com:17622');
var client = redis.createClient(redisURL.port, redisURL.hostname, {
    no_ready_check: true
});
client.auth(redisURL.auth.split(":")[1]);
var raccoon = require('raccoon');
raccoon.connect(redisURL.port, redisURL.hostname, redisURL.auth.split(":")[1]);

var getErrorMessage = function(err) {
    if (err.errors) {
        for (var errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].message;
        }
    } else {
        return 'Unknown server error';
    }
};

exports.create = function(req, res) {
    var article = req.article;
    // // console.log(req.article);
    article._favorites = req.user;
    article.save(function(err) {
        if (err) {
            req.flash('errors', {
                msg: 'Oops! Failed to like verse.'
            });
        }
        res.redirect('/api/articles');

    });
    //recommendation data
    console.log("API: like");
    //article id
    console.log(req.article._id);
    //user id
    console.log(req.user._id);
    //liked function to store a like instance in redis server
    raccoon.liked(req.article._id, req.user._id, function() {
        client.smembers('movie:' + req.user._id + ':liked', function(err, results) {
            console.log('req.user._id liked:' + results[0]);
            // res.redirect('/api/articles');
        });
    });

};

exports.dislike = function(req, res) {
    var article = req.article;
    // // console.log(req.article);
    article._dislikes = req.user;
    article.save(function(err) {
        if (err) {
            req.flash('errors', {
                msg: 'Oops! Failed to dislike verse.'
            });
        }
        res.redirect('/api/articles');

    });
    //recommendation data
    console.log("API: dislike");
    //article id
    console.log(req.article._id);
    //user id
    console.log(req.user._id);
    //liked function to store a like instance in redis server
    raccoon.disliked(req.article._id, req.user._id, function() {
        client.smembers('movie:' + req.user._id + ':disliked', function(err, results) {
            console.log('req.user._id disliked:' + results[0]);
            // res.redirect('/api/articles');
        });
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


    // raccoon.liked(req.article._id, req.user._id, function() {
    //     client.smembers('movie:' + req.user._id + ':liked', function(err, results) {
    //         console.log('req.user._id liked:' + results[0]);
    //         // res.redirect('/api/articles');
    //     });
    // });
    raccoon.liked('garyId', 'movieId');
    raccoon.liked('garyId', 'movie2Id');
    raccoon.liked('chrisId', 'movieId');

    client.smembers('movie:garyId:liked', function(err, results) {
        if(err){
            console.log(getErrorMessage(err));
        }
        console.log('req.user._id liked:' + results[0]);
        // res.redirect('/api/articles');
    });
    // Ask for recommendations:

    raccoon.recommendFor('chrisId', 10, function(results) {
        // results will be an array of x ranked recommendations for chris
        // in this case it would contain movie2
        console.log(results[0]);
    });
    // raccoon.recommendFor(req.user._id, 5, function(recs) {

    //     console.log(recs);
    //     res.format({
    //         html: function() {
    //             res.render('pages/recommendations', {
    //                 title: 'Recommendations',
    //                 "recs": recs
    //             });
    //         },
    //         json: function() {
    //             res.json(recs);
    //         }
    //     });

    // });
}