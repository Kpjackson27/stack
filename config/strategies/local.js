// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	User = require('mongoose').model('User');

// Create the Local strategy configuration method
module.exports = function() {
// Use the Passport's Local strategy 
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
};