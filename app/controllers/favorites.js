'use strict';

// var _ = require('lodash'),
//   async = require('async'),
//   crypto = require('crypto'),
//   passport = require('passport'),
//   nodemailer = require('nodemailer'),
//   User = require('../models/User'),
//   Article = require('../models/Article');

//import raccoon module
var raccoon = require('raccoon');
//import redies module
exports.create = function(req, res) {
    // var article = req.article;
    // // console.log(req.article);
    // article._favorites = req.user;
    // article.save(function (err) {
    //   if (err) {
    //     req.flash('errors', { msg: 'Oops! Failed to like verse.'});
    //   } 
    //   res.redirect('/api/articles');

    // });
    //recommendation data
    //article id
    console.log(req.article._id);
    //user id
    console.log(req.user._id);
    //liked function to store a like instance in redis server
    // raccoon.liked(req.article._id, req.user._id, function() {
    //     client.smembers('movie:chris:liked', function(err, results) {
    //         console.log(results[0], 'batman');
    //         res.redirect('/api/articles');
    //     });
    // });

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