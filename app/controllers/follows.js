'use strict';

// var mongoose = require('mongoose'),
//     User = mongoose.model('User'),
//     async = require('async');

exports.follow = function (req, res) {
  var user = req.user,
      id = req.body.fid;
  user.follow(id);
  user.save(function (err) {
    if (err) {
      req.flash('errors', { msg: 'Oops! Failed to follow user.'});
    } 
    // res.redirect('/');
    // res.json({success: true});
  });
};

exports.unfollow = function(req, res, next) {
	//unfollow a user here.
};

