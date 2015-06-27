'use strict';

//Load the module dependencies
var passport = require('passport'),
	mongoose = require('mongoose');

//Define the Passport configuration method
module.exports = function() {
	//Load the 'User' model
	var User = mongoose.model('User');

	//Use Passport's 'serializeUser' method to serialize the user id
	passport.serializeUser(function(user,done){
		done(null, user.id);
	});

	//Use passport's 'deserializedUser' method to load the user document
	passport.deserializeUser(function(id, done){
		User.findOne({
			_id: id	
			}, '-password -salt', function(err,user){
				done(err,user);	
		});
	});


	//Load the Passport's strategies configuration
	require('./strategies/local.js')();
};