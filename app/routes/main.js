'use strict';

//Load the module dependencies
var users = require('../../app/controllers/users'),
	passport = require('passport'),
	main = require('../controllers/main');

	var passportConf = require('../../config/passport');

module.exports = function(app){

	//Mount the 'index' controller's 'render' method
	app.route('/main')
		.get(passportConf.isAuthenticated, main.render);
};