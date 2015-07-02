
'use strict';

// var _ = require('lodash'),
//   async = require('async'),
//   crypto = require('crypto'),
//   passport = require('passport'),
//   nodemailer = require('nodemailer'),
//   User = require('../models/User'),
//   Article = require('../models/Article');

exports.create = function (req, res) {
  var article = req.article;
  // console.log(req.article);
  article._favorites = req.user;
  article.save(function (err) {
    if (err) {
      req.flash('errors', { msg: 'Oops! Failed to like verse.'});
    } 
    res.redirect('/api/articles');

  });
};


// ### Delete Favorite
exports.destroy = function (req, res) {
  var article = req.article;
  article._favorites = req.user;
  article.save(function (err) {
    if (err) return res.send(400);
    res.send(200);
  });
};
