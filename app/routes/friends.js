'use strict';

//Load the module dependencies
var users = require('../../app/controllers/users'),
	passport = require('passport'),
	friends = require('../controllers/friends'),
	passportConf = require('../../config/passport');

module.exports = function(app){
	
	//Mount the 'index' controller's 'render' method
	app.route('/friends')
		.get(passportConf.isAuthenticated , friends.render);
};