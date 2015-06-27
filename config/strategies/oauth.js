'use strict';

var _ = require('lodash'),
	passport = require('passport'),
	OAuth2Strategy = require('passport-oauth').OAuth2Strategy,
	User = require('mongoose').model('User');

//Create the local stratgegy configuration method
module.exports = function(){
	//Use the Passport's oauth strategy
	
}