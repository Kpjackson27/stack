'use strict';

//Load the module dependencies
var _ = require('lodash');
var passport = require('passport'),
    mongoose = require('mongoose'),
    LocalStrategy = require('passport-local').Strategy;

var User = require('../app/models/User');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {
  email = email.toLowerCase();
  User.findOne({ email: email }, function(err, user) {
    if (!user) return done(null, false, { message: 'Email ' + email + ' not found'});
    user.comparePassword(password, function(err, isMatch) {
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid email or password.' });
      }
    });
  });
}));


/**
 * Login Required middleware.
 */
exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
  	return next();
  }
  return res.redirect('/landing');
};

/**
 * Authorization Required middleware.
 */
exports.isAuthorized = function(req, res, next) {
  var provider = req.path.split('/').slice(-1)[0];

  if (_.find(req.user.tokens, { kind: provider })) {
    next();
  } else {
    return res.redirect('/auth/' + provider);
  }
};
//Define the Passport configuration method
// module.exports = function() {
// 	//Load the 'User' model
// 	var User = mongoose.model('User');

// 	//Use Passport's 'serializeUser' method to serialize the user id
// 	passport.serializeUser(function(user,done){
// 		done(null, user.id);
// 	});

// 	//Use passport's 'deserializedUser' method to load the user document
// 	passport.deserializeUser(function(id, done){
// 		User.findOne({
// 			_id: id	
// 			}, '-password -salt', function(err,user){
// 				done(err,user);	
// 		});
// 	});


// 	//Load the Passport's strategies configuration
// 	require('./strategies/local.js')();
// };