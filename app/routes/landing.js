'use strict';

//Load the module dependencies
var users = require('../../app/controllers/users'),
	passport = require('passport'),
	landing = require('../controllers/landing');

	var passportConf = require('../../config/passport');

module.exports = function(app){

	//Mount the 'index' controller's 'render' method
	app.route('/landing')
		.get(landing.render)
		.post(users.postLogin);
};