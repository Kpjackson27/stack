'use strict';

// var mongoose = require('mongoose'),
//     User = mongoose.model('User'),
//     async = require('async');

exports.follow = function (req, res, next) {
  console.log('?:'+req.body.fid);
  var user = req.user,
      id = req.body.fid;
  user.follow(id);
  user.save(function (err) {
    if (err) {
      req.flash('errors', { msg: 'Oops! Failed to follow user.'});
    } 
    console.log('following:' +user.following);
    res.redirect('/');
  });
};

exports.unfollow = function(req, res, next) {
	//unfollow a user here.
};

