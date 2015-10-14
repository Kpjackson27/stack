'use strict';

//Load the module dependencies
var users = require('../../app/controllers/users'),
	passport = require('passport'),
	settings = require('../controllers/settings'),
	passportConf = require('../../config/passport');

module.exports = function(app){
	
	//Mount the 'index' controller's 'render' method
	app.route('/settings')
		.get(passportConf.isAuthenticated, settings.render);
	   
};